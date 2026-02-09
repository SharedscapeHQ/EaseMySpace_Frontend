import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { getAllJobs, applyForJob } from "../../../api/jobApi";
import { toast } from "react-hot-toast";

export default function JobDetail() {
  const { titleAndId } = useParams(); // ✅ fixed
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const resumeRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch (error) {
        toast.error("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading job...</p>;


  const jobId =
    typeof titleAndId === "string" && titleAndId.includes("-")
      ? titleAndId.split("-").pop()
      : titleAndId?.toString();


  const job = jobs.find((j) => j.id?.toString() === jobId);

  if (!job)
    return <p className="p-6 text-center text-red-500">Job not found.</p>;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioURL(URL.createObjectURL(blob));
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch {
      toast.error("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioURL("");
    setRecording(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let audioFile = null;
      if (audioURL) {
        const res = await fetch(audioURL);
        const blob = await res.blob();
        audioFile = new File([blob], "intro.mp3", { type: "audio/mpeg" });
      }

      const applicationData = {
        name: fullName.trim(),
        role: job.role,
        email: email.trim(),
        phone: phone.trim(),
        resume: resumeRef.current?.files[0] || null,
        audio: audioFile,
      };

      await applyForJob(applicationData);
      toast.success("Application submitted successfully!");

      setFullName("");
      setEmail("");
      setPhone("");
      setAudioURL("");
      if (resumeRef.current) resumeRef.current.value = null;
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-20">
      <Link
        to="/careers"
        className="inline-block mb-6 text-blue-600 hover:underline font-medium"
      >
        ← Back to Careers
      </Link>

      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-8 flex flex-col lg:flex-row gap-10">
        <div className="lg:w-[60%] space-y-6">
          <h1 style={{ fontFamily: "para_font" }} className="text-4xl capitalize font-bold text-gray-900">
            {job.role}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <MetaTag icon={<FaBriefcase />} text={job.dept} color="blue" />
            {job.location && (
              <MetaTag icon={<FaMapMarkerAlt />} text={job.location} color="green" />
            )}
            {job.salary && (
              <MetaTag icon={<FaRupeeSign />} text={job.salary} color="yellow" />
            )}
            {job.experience && (
              <MetaTag icon={<FaClock />} text={`${job.experience} exp`} color="indigo" />
            )}
          </div>

          <div className="prose prose-indigo max-w-none text-gray-800 whitespace-pre-line">
            <Section title="Job Overview" content={job.description} />
            {job.responsibilities?.length > 0 && <ListSection title="Responsibilities" items={job.responsibilities} />}
            {job.requirements?.length > 0 && <ListSection title="Requirements" items={job.requirements} />}
            {job.perks?.length > 0 && <ListSection title="Perks & Benefits" items={job.perks} />}
          </div>
        </div>

        <div className="bg-gray-100 lg:w-[45%] p-6 rounded-lg shadow-inner">
          <h2 style={{ fontFamily: "para_font" }} className="text-2xl font-semibold mb-6 text-gray-900">
            Apply for this job
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <InputField label="Full Name" value={fullName} onChange={setFullName} placeholder="Your full name" required />
            <InputField label="Role" value={job.role} readOnly />
            <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="Your email address" required />
            <InputField label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="10-digit phone number" pattern="\d{10}" maxLength={10} required />
            <FileUpload ref={resumeRef} />

            <div>
              <label className="block text-gray-700 font-medium mb-2">Intro (Optional)</label>
              {!recording ? (
                <button type="button" onClick={startRecording} className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition">
                  🎙 Start Recording
                </button>
              ) : (
                <button type="button" onClick={stopRecording} className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition">
                  ⏹ Stop Recording
                </button>
              )}
            </div>

            {audioURL && (
              <div className="mt-3 space-y-2">
                <audio controls src={audioURL} className="w-full rounded-md" />
                <div className="flex space-x-3">
                  <button type="button" onClick={startRecording} className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md">🔄 Retake</button>
                  <button type="button" onClick={deleteRecording} className="flex-1 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md">🗑 Delete</button>
                </div>
              </div>
            )}

            <button type="submit" disabled={submitting} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold">
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Helper Components */
function MetaTag({ icon, text, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };
  return <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${colors[color]}`}>{icon} {text}</span>;
}

function Section({ title, content }) {
  return (
    <>
      <h2 style={{ fontFamily: "para_font" }} className="text-2xl font-semibold">{title}</h2>
      <p>{content}</p>
    </>
  );
}

function ListSection({ title, items }) {
  return (
    <>
      <h2 style={{ fontFamily: "para_font" }} className="text-2xl font-semibold mt-4">{title}</h2>
      <ul className="list-disc pl-6">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 mt-1"><FaCheckCircle className="text-green-500 mt-1" /> {item}</li>
        ))}
      </ul>
    </>
  );
}

const InputField = ({ label, type = "text", value, onChange, readOnly = false, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input type={type} value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} readOnly={readOnly} className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${readOnly ? "bg-gray-200 cursor-not-allowed" : "focus:ring-indigo-500 bg-white"}`} {...props} />
  </div>
);

const FileUpload = React.forwardRef((props, ref) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">Attach Resume</label>
    <input ref={ref} type="file" accept=".pdf,.doc,.docx" required className="w-full border border-gray-300 rounded-md p-2 bg-white cursor-pointer" {...props} />
  </div>
));
