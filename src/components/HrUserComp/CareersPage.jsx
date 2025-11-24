import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getAllJobs, addJob, updateJob, deleteJob } from "../../api/jobApi";

// Enhanced Tags Input
function TagsInput({ tags, setTags, placeholder }) {
  const [input, setInput] = useState("");

  const addTag = (value) => {
    const newTags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag && !tags.includes(tag));

    if (newTags.length) setTags([...tags, ...newTags]);
  };

  const handleKeyDown = (e) => {
  if (e.key === "Enter") {   
    e.preventDefault();
    const value = input.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
    }
    setInput(""); 
  } else if (e.key === "Backspace" && !input) {
    setTags(tags.slice(0, -1)); 
  }
};


 const handlePaste = (e) => {
  e.preventDefault();
  const paste = e.clipboardData.getData("text").trim();
  if (paste && !tags.includes(paste)) setTags([...tags, paste]);
  setInput("");
};

  return (
    <div className="border rounded-md px-2 py-1 flex flex-wrap gap-1 focus-within:ring-2 focus-within:ring-indigo-300 transition">
      {tags.map((tag, idx) => (
        <motion.div
          key={idx}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded flex items-center gap-1"
        >
          <span>{tag}</span>
          <button
            type="button"
            className="text-indigo-500 font-bold"
            onClick={() => setTags(tags.filter((_, i) => i !== idx))}
          >
            ×
          </button>
        </motion.div>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={placeholder}
        className="flex-1 border-none outline-none px-1 py-1"
      />
    </div>
  );
}

// Confirm Modal
function ConfirmModal({ show, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50 inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-white rounded-xl shadow-2xl p-6 w-80 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this job? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    role: "", dept: "", location: "", description: "",
    responsibilities: [], requirements: [], perks: [],
    salary: "", experience: ""
  });
  const [editJob, setEditJob] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch jobs");
    }
  };

  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit && editJob) setEditJob({ ...editJob, [name]: value });
    else setNewJob({ ...newJob, [name]: value });
  };

  const handleAddJob = async () => {
    try {
      await addJob(newJob);
      toast.success("Job added successfully");
      setNewJob({
        role: "", dept: "", location: "", description: "",
        responsibilities: [], requirements: [], perks: [],
        salary: "", experience: ""
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add job");
    }
  };

  const handleEditJob = async () => {
    try {
      await updateJob(editJob.id, editJob);
      toast.success("Job updated successfully");
      setEditJob(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job");
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await deleteJob(id);
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job");
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.role.toLowerCase().includes(search.toLowerCase()) ||
    job.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "para_font" }} className="p-6 max-w-6xl mx-auto">
      <h1 style={{ fontFamily: "heading_font" }} className="text-3xl text-zinc-800 mb-6">
        Careers
      </h1>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl p-6 mb-6 shadow-lg border"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {editJob ? "Edit Job" : "Add New Job"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["role", "dept", "location", "salary", "experience"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={editJob ? editJob[field] : newJob[field]}
              onChange={(e) => handleChange(e, !!editJob)}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
          ))}
        </div>

        <textarea
          name="description"
          value={editJob ? editJob.description : newJob.description}
          onChange={(e) => handleChange(e, !!editJob)}
          placeholder="Job Description"
          className="border rounded-md px-3 py-2 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          rows={3}
        />

        {["responsibilities", "requirements", "perks"].map((field) => (
          <div key={field} className="mt-3">
            <label className="text-gray-600 mb-1 block font-medium">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <TagsInput
              tags={editJob ? editJob[field] : newJob[field]}
              setTags={(tags) => {
                if (editJob) setEditJob({ ...editJob, [field]: tags });
                else setNewJob({ ...newJob, [field]: tags });
              }}
              placeholder={`Add ${field} (',' or Enter)`}
            />
          </div>
        ))}

        <div className="flex justify-end mt-5">
          <button
            onClick={editJob ? handleEditJob : handleAddJob}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition shadow-md"
          >
            <FiPlus /> {editJob ? "Update Job" : "Add Job"}
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by role or department"
          className="border rounded-md px-3 py-2 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
      </div>

      {/* Jobs Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-4 shadow-lg border overflow-x-auto"
      >
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Dept</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Experience</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 border-b"
                >
                  <td className="px-4 py-2">{job.role}</td>
                  <td className="px-4 py-2">{job.dept}</td>
                  <td className="px-4 py-2">{job.location}</td>
                  <td className="px-4 py-2">{job.salary}</td>
                  <td className="px-4 py-2">{job.experience}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      onClick={() =>
                        setEditJob({
                          ...job,
                          responsibilities: job.responsibilities || [],
                          requirements: job.requirements || [],
                          perks: job.perks || [],
                        })
                      }
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => setDeleteId(job.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Confirm Modal */}
      <ConfirmModal
        show={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          handleDeleteJob(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
