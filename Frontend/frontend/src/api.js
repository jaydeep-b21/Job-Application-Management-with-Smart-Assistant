const API_BASE = "http://localhost:5000/applications";

export const fetchApplications = async () => {
  const res = await fetch(API_BASE);
  return res.json();
};

export const addApplication = async (formData) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    body: formData,
  });
  return res.json();
};

export const updateApplication = async (id, formData) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    body: formData,
  });
  return res.json();
};

export const deleteApplication = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  return res.json();
};

export const fetchFilesForApplication = async (applicationId) => {
  const res = await fetch(`${API_BASE}/${applicationId}/files`);
  return res.json();
};
