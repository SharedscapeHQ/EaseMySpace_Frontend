import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
      <Link
        to="/careers"
        className="inline-block mb-8 text-blue-600 hover:underline font-medium"
      >
        ← Back to Careers
      </Link>

      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left side - Job Info */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-semibold text-gray-900">{job.role}</h1>
          <p className="text-lg text-gray-600">
            <span className="font-medium">{job.dept}</span> • {job.location}
          </p>

          {/* Job details (add fields if available in your job data) */}
          {job.experience && (
            <p className="text-gray-700">
              <strong>Experience:</strong> {job.experience}
            </p>
          )}
          {job.salary && (
            <p className="text-gray-700">
              <strong>Salary:</strong> {job.salary}
            </p>
          )}

          <div className="prose prose-indigo max-w-none text-gray-800 whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {/* Right side - Application Form */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Apply for this job</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
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
                placeholder="Your email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone</label>
              <input
                type="tel"
                placeholder="Your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Attach Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
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
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
