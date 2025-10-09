import React, { useState, useEffect, useRef } from "react";
import {
  FaBriefcase,
  FaHome,
  FaBook,
  FaHeartbeat,
  FaUmbrellaBeach,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllJobs, applyForJob } from "../../../api/jobApi";
import { toast } from "react-hot-toast";

export default function Careers() {
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState("");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const resumeRef = useRef(null);
  

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        
        setJobs(data);
      } catch (err) {
        toast.error("Failed to load job openings.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Recording logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioURL(URL.createObjectURL(blob));
        chunks = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setTimeLeft(300);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      recorder.timerRef = timer;
    } catch {
      toast.error("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      clearInterval(mediaRecorder.timerRef);
    }
  };

  const deleteRecording = () => {
    setAudioURL("");
    setTimeLeft(300);
    setRecording(false);
    if (mediaRecorder?.timerRef) clearInterval(mediaRecorder.timerRef);
  };

  const retakeRecording = () => {
    deleteRecording();
    startRecording();
  };

  // Form submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    // Convert audioURL to MP3 File if exists
    let audioFile = null;
    if (audioURL) {
      const response = await fetch(audioURL);
      const audioBlob = await response.blob();

      // Convert webm blob to mp3 file
      audioFile = new File([audioBlob], "intro.mp3", { type: "audio/mpeg" });
    }

    // Build application object
    const applicationData = {
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      phone: phone.trim(),
      resume: resumeFile || null, // Resume included here
      audio: audioFile,
    };

    // Call API
    await applyForJob(applicationData);

    toast.success("Application submitted successfully!");

    // Reset form
    setName("");
    setRole("");
    setEmail("");
    setPhone("");
    setResumeFile(null);
    setAudioURL("");

    if (resumeRef.current) {
  resumeRef.current.value = null;
}
  } catch (err) {
    console.error(err);
    toast.error("Failed to submit application. Try again.");
  } finally {
    setSubmitting(false);
  }
};



  const perks = [
    { icon: <FaBriefcase />, text: "Competitive salary and annual performance bonuses" },
    { icon: <FaHome />, text: "Flexible remote or hybrid work arrangements" },
    { icon: <FaBook />, text: "Access to training, courses, and professional development" },
    { icon: <FaHeartbeat />, text: "Comprehensive health, dental, and vision insurance" },
    { icon: <FaUmbrellaBeach />, text: "Generous paid time off and wellness days" },
    { icon: <FaUsers />, text: "Inclusive, diverse, and collaborative team culture" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
     <section
  className="bg-blue-700 text-white py-16 px-6 text-center"
  itemScope
  itemType="https://schema.org/JobPosting"
>
  <h1
    style={{ fontFamily: "heading_font" }}
    className="text-4xl font-bold mb-4"
    itemProp="title"
  >
    Join Our Team at EaseMySpace – Careers in Mumbai
  </h1>
  <p
    className="max-w-3xl mx-auto text-lg"
    itemProp="description"
  >
    Be part of EaseMySpace, an innovative startup in Mumbai transforming how people find PGs, flats, and flatmates. Explore exciting career opportunities in IT, development, operations, and marketing with hybrid work, remote work, or work-from-home options.
  </p>
  <meta itemProp="employmentType" content="Full-time" />
  <meta itemProp="jobLocation" content="Mumbai, India" />
  <meta itemProp="hiringOrganization" content="EaseMySpace" />
  <meta itemProp="workHours" content="Hybrid, WFH, Full-time" />
</section>


      {/* Open Positions */}
      <section className="py-12 px-6 lg:px-20">
        <h2 className="text-2xl font-semibold mb-8">Open Positions</h2>
        {loading ? (
          <p className="text-gray-600">Loading job openings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{job.role}</h3>
                  <p className="text-sm text-blue-600 mt-1">{job.dept}</p>
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3">{job.description}</p>
                </div>
                <Link
  to={`/jobs/${job.role.toLowerCase().replace(/\s+/g, "-")}-${job.id}`}
  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center font-medium transition-all duration-300 hover:scale-[1.03]"
>
  Apply Now
</Link>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-lg">
            No openings at the moment — stay tuned! You can still submit your application below.
          </p>
        )}
      </section>

      {/* Perks & Benefits + Form */}
      <section className="bg-white py-16 px-6 lg:px-20 border-t border-gray-200">
        <div className="mx-auto mb-12">
          <h2 style={{ fontFamily: "heading_font" }} className="text-[16px] lg:text-3xl text-left text-black">
            We’re Always Looking for Great Talent
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Left - Perks */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Perks & Benefits</h2>
            <ul className="space-y-4">
              {perks.map((perk, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">{perk.icon}</span>
                  <span className="text-gray-700">{perk.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Application Form */}
         <form className="space-y-6" onSubmit={handleSubmit}>
  {/* Full Name & Role */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col">
      <label htmlFor="name" className="mb-1 font-medium text-gray-700">
        Full Name
      </label>
      <input
        id="name"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
    </div>
    <div className="flex flex-col">
      <label htmlFor="role" className="mb-1 font-medium text-gray-700">
        Role You're Applying For
      </label>
      <input
        id="role"
        type="text"
        placeholder="Role you're applying for"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
    </div>
  </div>

  {/* Email & Phone */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col">
      <label htmlFor="email" className="mb-1 font-medium text-gray-700">
        Email
      </label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
    </div>
    <div className="flex flex-col">
      <label htmlFor="phone" className="mb-1 font-medium text-gray-700">
        Phone
      </label>
      <input
        id="phone"
        type="tel"
        placeholder="Enter your phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        pattern="\d{10}"
        maxLength="10"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
    </div>
  </div>

  {/* Resume & Recording */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col">
      <label htmlFor="resume" className="mb-1 font-medium text-gray-700">
        Upload Resume
      </label>
      <input
      ref={resumeRef}
        id="resume"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResumeFile(e.target.files[0])}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none"
        required
      />
    </div>

    <div>
      <label className="mb-1 font-medium text-gray-700 block">Audio Introduction</label>
      {!recording ? (
        <button
          type="button"
          onClick={startRecording}
          className="px-4 py-2 w-full bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
        >
          🎙 Record
        </button>
      ) : (
        <button
          type="button"
          onClick={stopRecording}
          className="px-4 py-2 w-full bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
        >
          ⏹ Stop
        </button>
      )}
      <p className="text-xs text-gray-500 mt-1">
        Record in a quiet, noise-free environment. Max 5 mins.
      </p>
    </div>
  </div>

  {/* Audio Preview */}
  {audioURL && (
    <div className="space-y-3">
      <audio controls src={audioURL} className="w-full"></audio>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={retakeRecording}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none"
        >
          🔄 Retake
        </button>
        <button
          type="button"
          onClick={deleteRecording}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  )}

  {/* Submit */}
  <div className="text-center">
    <button
      type="submit"
      disabled={submitting}
      className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-lg focus:outline-none"
    >
      {submitting ? "Submitting..." : "Submit"}
    </button>
  </div>
</form>

        </div>
      </section>
    </div>
  );
}
