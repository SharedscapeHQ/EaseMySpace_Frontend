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
  const { id } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState("");

  // Form fields
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
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading job...</p>;

  const job = jobs.find((j) => j.id?.toString() === id);

  if (!job) return <p className="p-6 text-center text-red-500">Job not found.</p>;

  // Recording functions
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
        const response = await fetch(audioURL);
        const audioBlob = await response.blob();
        audioFile = new File([audioBlob], "intro.mp3", { type: "audio/mpeg" });
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

      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setAudioURL("");
      if (resumeRef.current) resumeRef.current.value = null;
    } catch (error) {
      console.error(error);
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
        {/* Left - Job Info */}
        <div className="lg:w-[60%] space-y-6">
          <h1 className="text-4xl capitalize font-bold text-gray-900">{job.role}</h1>

          {/* Job Meta */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              <FaBriefcase /> {job.dept}
            </span>
            {job.location && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <FaMapMarkerAlt /> {job.location}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                <FaRupeeSign /> {job.salary}
              </span>
            )}
            {job.experience && (
              <span className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                <FaClock /> {job.experience} exp
              </span>
            )}
          </div>

          {/* Job Description */}
          <div className="prose prose-indigo max-w-none text-gray-800 whitespace-pre-line">
            <h2 className="text-2xl font-semibold">Job Overview</h2>
            <p>{job.description}</p>

            {job.responsibilities?.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mt-4">Responsibilities</h2>
                <ul className="list-disc pl-6">
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 mt-1">
                      <FaCheckCircle className="text-green-500 mt-1" /> {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {job.requirements?.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mt-4">Requirements</h2>
                <ul className="list-disc pl-6">
                  {job.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 mt-1">
                      <FaCheckCircle className="text-green-500 mt-1" /> {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {job.perks?.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mt-4">Perks & Benefits</h2>
                <ul className="list-disc pl-6">
                  {job.perks.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 mt-1">
                      <FaCheckCircle className="text-blue-500 mt-1" /> {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Right - Application Form */}
        <div className="bg-gray-100 w-[45%] p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Apply for this job</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Role</label>
              <input
                type="text"
                value={job.role}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit phone number"
                pattern="\d{10}"
                maxLength={10}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Attach Resume</label>
              <input
                ref={resumeRef}
                type="file"
                accept=".pdf,.doc,.docx"
                required
                className="w-full border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Intro (Optional)</label>
              {!recording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                >
                  🎙 Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                >
                  ⏹ Stop Recording
                </button>
              )}
            </div>

            {audioURL && (
              <div className="mt-3 space-y-2">
                <audio controls src={audioURL} className="w-full rounded-md"></audio>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                  >
                    🔄 Retake
                  </button>
                  <button
                    type="button"
                    onClick={deleteRecording}
                    className="flex-1 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
