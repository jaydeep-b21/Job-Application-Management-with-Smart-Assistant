// App.js
import React, { useEffect, useState } from "react";
import {
  fetchApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  fetchFilesForApplication,
} from "./api";
import JobModal from "./components/JobModal";
import ConfirmDelete from "./components/ConfirmDelete";
import FileViewerModal from "./components/FileViewerModal";
import ScrollingEmoji from "./components/ScrollingEmoji";
import Chatbot from "./components/Chatbot";

import "./App.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function App() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({});
  const [mediaFiles, setMediaFiles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const loadData = async () => {
    const data = await fetchApplications();
    setApplications(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setForm({});
    setMediaFiles([]);
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (app) => {
    const parseDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");
    setForm({
      ...app,
      date_applied: parseDate(app.date_applied),
      follow_up_date: parseDate(app.follow_up_date),
    });
    setEditId(app.id);
    setMediaFiles([]);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media_file") {
      setMediaFiles(Array.from(files));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value || "");
    });
    mediaFiles.forEach((file) => formData.append("media_file", file));

    if (editId !== null) {
      await updateApplication(editId, formData);
    } else {
      await addApplication(formData);
    }

    setShowModal(false);
    loadData();
  };

  const confirmDelete = async () => {
    await deleteApplication(deleteId);
    setDeleteId(null);
    loadData();
  };

  const openFileViewer = async (appId) => {
    const files = await fetchFilesForApplication(appId);
    setCurrentFiles(files);
    setFileViewerOpen(true);
  };

  // Pagination
  const totalPages = Math.ceil(applications.length / rowsPerPage);
  const paginatedApps = applications.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="app-container">
      <ScrollingEmoji />
      <h1>Job Tracker Board</h1>

      <div className="top-bar">
        <button
          style={{ backgroundColor: "#b992c1", color: "white", fontWeight: 600 }}
          onClick={openAddModal}
        >
          ➕ New Job
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Job ID</th>
              <th>Company</th>
              <th>Job Title</th>
              <th>Source</th>
              <th>Job Link</th>
              <th>Status</th>
              <th>Date Applied</th>
              <th>Follow-Up</th>
              <th>Notes</th>
              <th>Media</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApps.map((app, index) => {
              const globalIndex = (currentPage - 1) * rowsPerPage + index;
              return (
                <tr key={app.id} className="table-row hoverable-row">
                  <td style={{ fontWeight: "bold", color: "#333" }}>{globalIndex + 1}</td>
                  <td>{app.job_id}</td>
                  <td>{app.company}</td>
                  <td>{app.job_title}</td>
                  <td>{app.source}</td>
                  <td>
                    <a href={app.job_link} target="_blank" rel="noopener noreferrer">
                      Link 🔗
                    </a>
                  </td>
                  <td>{app.status}</td>
                  <td>{formatDate(app.date_applied)}</td>
                  <td>{formatDate(app.follow_up_date)}</td>
                  <td>{app.notes}</td>
                  <td>
                    <button onClick={() => openFileViewer(app.id)}>📁</button>
                  </td>
                  <td>
                    <button onClick={() => openEditModal(app)}>✏️</button>
                    <button onClick={() => setDeleteId(app.id)} className="danger">
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ⬅️ Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next ➡️
          </button>
        </div>
      </div>

      <JobModal
        isOpen={showModal}
        form={form}
        onChange={handleChange}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        isEdit={editId !== null}
        mediaFiles={mediaFiles}
      />

      <ConfirmDelete
        isOpen={deleteId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <FileViewerModal
        isOpen={fileViewerOpen}
        files={currentFiles}
        onClose={() => setFileViewerOpen(false)}
      />
      <Chatbot />
    </div>
  );
}

export default App;
