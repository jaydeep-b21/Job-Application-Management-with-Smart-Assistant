import React, { useEffect, useState } from "react";

const statusOptions = [
  "Applied",
  "Interview Scheduled",
  "Offer",
  "Rejected",
  "Accepted",
  "Other",
];

const sourceOptions = ["LinkedIn", "Naukri", "Company Website", "Other"];

export default function JobModal({ isOpen, form, onChange, onClose, onSubmit, isEdit }) {
  const [localForm, setLocalForm] = useState({});

  useEffect(() => {
    if (isOpen) {
      setLocalForm({
        ...form,
        date_applied: form.date_applied || "",
        follow_up_date: form.follow_up_date || "",
      });
    }
  }, [form, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media_file") {
      onChange(e); // pass the file input change to parent
    } else {
      setLocalForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      onChange(e);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal {
          background: #fff;
          padding: 20px 30px;
          border-radius: 8px;
          width: 700px;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        .modal h2 {
          margin-top: 0;
        }
        .modal label {
          display: block;
          margin-top: 12px;
          font-weight: bold;
        }
        .modal input,
        .modal select,
        .modal textarea {
          width: 100%;
          padding: 8px;
          margin-top: 4px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .modal textarea {
          resize: vertical;
          min-height: 60px;
        }
        .modal-actions {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .modal-actions button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }
        .modal-actions .cancel-btn {
          background-color: #bdc3c7;
          color: white;
        }
        .modal-actions .cancel-btn:hover {
          background-color: #95a5a6;
        }
        .modal-actions .primary-btn {
          background-color: #2ecc71;
          color: white;
        }
        .modal-actions .primary-btn:hover {
          background-color: #27ae60;
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal">
          <h2>{isEdit ? "Update Job" : "Add New Job"}</h2>

          <label>Job ID:</label>
          <input name="job_id" placeholder="Job ID" value={localForm.job_id || ""} onChange={handleChange} />

          <label>Company:</label>
          <input name="company" placeholder="Company" value={localForm.company || ""} onChange={handleChange} />

          <label>Job Title:</label>
          <input name="job_title" placeholder="Job Title" value={localForm.job_title || ""} onChange={handleChange} />

          <label>Source:</label>
          <select name="source" value={localForm.source || ""} onChange={handleChange}>
            <option value="">Select Source</option>
            {sourceOptions.map((src) => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>

          {localForm.source === "Other" && (
            <>
              <label>Specify Source:</label>
              <input
                name="source_other"
                placeholder="Enter source"
                value={localForm.source_other || ""}
                onChange={handleChange}
              />
            </>
          )}

          <label>Job Link:</label>
          <input name="job_link" placeholder="Job Link" value={localForm.job_link || ""} onChange={handleChange} />

          <label>Status:</label>
          <select name="status" value={localForm.status || ""} onChange={handleChange}>
            <option value="">--Select--</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {localForm.status === "Other" && (
            <>
              <label>Specify Status:</label>
              <input
                name="status_other"
                placeholder="Enter status"
                value={localForm.status_other || ""}
                onChange={handleChange}
              />
            </>
          )}

          <label>Date Applied:</label>
          <input name="date_applied" type="date" value={localForm.date_applied || ""} onChange={handleChange} />

          <label>Follow-Up Date:</label>
          <input name="follow_up_date" type="date" value={localForm.follow_up_date || ""} onChange={handleChange} />

          <label>Notes:</label>
          <textarea name="notes" placeholder="Notes" value={localForm.notes || ""} onChange={handleChange}></textarea>

          <label>Upload Files:</label>
          <input
            name="media_file"
            type="file"
            multiple
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button onClick={onSubmit} className="primary-btn">{isEdit ? "Update" : "Add"}</button>
            <button onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
