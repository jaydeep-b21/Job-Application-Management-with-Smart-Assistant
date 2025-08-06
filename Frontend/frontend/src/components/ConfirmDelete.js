// components/ConfirmDelete.js
import React from "react";

export default function ConfirmDelete({ isOpen, onConfirm, onCancel }) {
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
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(4px); /* 👈 Blur background */
        }

        .modal.small {
          background: white;
          padding: 20px 30px;
          border-radius: 8px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        button.danger {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        button.danger:hover {
          background-color: #c0392b;
        }

        button.cancel-btn {
          background-color: #bdc3c7;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        button.cancel-btn:hover {
          background-color: #95a5a6;
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal small">
          <h3>Are you sure you want to delete this job?</h3>
          <div className="modal-actions">
            <button onClick={onConfirm} className="danger">Yes, Delete</button>
            <button onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
