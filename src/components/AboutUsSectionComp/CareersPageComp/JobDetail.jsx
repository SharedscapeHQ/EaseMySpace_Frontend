import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaMicrophone,
  FaCheckCircle,
  FaBuilding
} from "react-icons/fa";
import jobs from "./jobsData";

export default function JobDetail() {
  const { id } = useParams();
  const job = jobs.find((j) => j.id.toString() === id);

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState("");

  if (!job) return <p className="p-6 text-center text-red-500">Job not found.</p>;

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
      alert("Microphone access denied or unavailable.");
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-20">
      {/* Breadcrumb */}
      <Link
        to="/careers"
        className="inline-block mb-6 text-blue-600 hover:underline font-medium"
      >
        ← Back to Careers
      </Link>

      {/* Job Header */}
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-8 flex flex-col lg:flex-row gap-10">
        {/* Left - Job Info */}
        <div className="lg:w-2/3 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{job.role}</h1>

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
                <FaDollarSign /> {job.salary}
              </span>
            )}
            {job.experience && (
              <span className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                <FaClock /> {job.experience} exp
              </span>
            )}
          </div>

          {/* Company Info */}
          {job.company && (
            <div className="flex items-center gap-2 text-gray-700 mt-4">
              <FaBuilding /> <span className="font-medium">{job.company}</span>
            </div>
          )}

          {/* Job Description */}
          <div className="prose prose-indigo max-w-none text-gray-800 whitespace-pre-line">
            <h2 className="text-2xl font-semibold">Job Overview</h2>
            <p>{job.description}</p>

            {job.responsibilities && (
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

            {job.requirements && (
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

            {job.perks && (
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
        <div className="lg:w-1/3 bg-gray-100 p-6 rounded-xl shadow-lg space-y-5">
          <h2 className="text-2xl font-semibold text-gray-900">Apply for this role</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                placeholder="Your phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Attach Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
              />
            </div>

            {/* Intro Recording */}
            <div>
              <label className="block text-gray-700 mb-2">Intro (Optional)</label>
              {!recording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center gap-2"
                >
                  <FaMicrophone /> Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center gap-2"
                >
                  ⏹ Stop Recording
                </button>
              )}
            </div>

            {audioURL && (
              <div className="mt-2 space-y-2">
                <audio controls src={audioURL} className="w-full rounded-md"></audio>
                <div className="flex gap-3">
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
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
