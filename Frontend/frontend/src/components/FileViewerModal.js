import React from "react";

function FileViewerModal({ isOpen, files, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .fileviewer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px); /* Blur background */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .fileviewer-modal {
          background-color: #fff;
          border-radius: 10px;
          padding: 20px;
          width: 400px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .fileviewer-header {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 18px;
          color: #222;
          font-weight: 600;
          text-align: center;
        }

        .fileviewer-close-btn {
          margin-top: 1rem;
          background-color: #333;
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 13px;
        }

        .fileviewer-list li {
          margin-bottom: 0.5rem;
        }

        .fileviewer-list a {
          color: #2c3e50;
          font-size: 14px;
          text-decoration: none;
        }

        .fileviewer-list a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="fileviewer-backdrop">
        <div className="fileviewer-modal">
          <h3 className="fileviewer-header">📁 Uploaded Files</h3>
          {files.length === 0 ? (
            <p>No files uploaded.</p>
          ) : (
            <ul className="fileviewer-list">
              {files.map((file) => (
                <li key={file.id}>
                  <a
                    href={`http://localhost:5000/media/${file.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.filename}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <button className="fileviewer-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}

export default FileViewerModal;
