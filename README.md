# Job Application Management with Smart Assistant

A full-stack **Job Application Tracker** with a built-in **AI-powered Smart Assistant** to help you manage, track, and analyze your job applications effectively.  
The project provides CRUD operations for job applications, file upload support, and an integrated chatbot (powered by **Google Gemini**) that can answer natural language questions about your applications.

---

##  Features

-  **Job Applications Management**
  - Add, update, delete, and view job applications
  - Store details such as company, job title, application date, status, notes, etc.
  - Automatic ordering by latest application date

-  **File Management**
  - Upload resumes, cover letters, and supporting documents
  - View all files associated with an application
  - Files saved with unique naming convention.

-  **Smart Assistant (Chatbot)**
  - Powered by **Google Gemini (Generative AI)**
  - Streams real-time responses
  - Can answer questions like:
    - “Which applications are pending follow-up?”
    - “When did I apply to Google?”
    - “List jobs I applied to last month”

-  **RESTful API Endpoints**
  - Exposed via Flask with **CORS** support
  - JSON-based responses for easy frontend integration

---

##  Demo

![Demo](demo/job_smart_asst_gif1.gif)

> _A step-by-step guide to how the job tracker board and smart assistant operates_

---
##  Tech Stack

- **Backend:** Flask (Python)
- **Database:** MySQL
- **AI Assistant:** Google Gemini API
- **File Handling:** Local `uploads/` directory
- **Other:** Flask-CORS, Werkzeug (for secure file uploads)

---

## 📂 Project Structure

```

Job-Application-Management-with-Smart-Assistant/
│── app.py                 # Flask backend with APIs & chatbot
│── uploads/               # Uploaded media files
│── requirements.txt       # Python dependencies
│── README.md              # Project documentation
```
---

##  Installation & Setup

### 1️ Clone the Repository

```bash
git clone https://github.com/yourusername/Job-Application-Management-with-Smart-Assistant.git
cd Job-Application-Management-with-Smart-Assistant
```

### 2️ Create & Activate Virtual Environment (Optional but Recommended)

```bash
python -m venv venv
source venv/bin/activate   # On Mac/Linux
venv\Scripts\activate      # On Windows
```

### 3️ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4 Configure MySQL Database

Create a database and update `app.py` with your MySQL credentials:

```sql
CREATE DATABASE job_tracker;
```

Tables:

```sql
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(50),
    date_applied DATE,
    company VARCHAR(100),
    job_title VARCHAR(100),
    source VARCHAR(100),
    job_link TEXT,
    status VARCHAR(50),
    follow_up_date DATE,
    notes TEXT
);

CREATE TABLE application_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT,
    filename VARCHAR(255),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);
```

### 5️ Set Your Google Gemini API Key

In `app.py`:

```python
genai.configure(api_key=GEMINI_API_KEY)
```

### 6️ Run the Application

```bash
python app.py
```

App will be available at:
 `http://127.0.0.1:5000`

---

##  API Endpoints

### Applications

* `GET /applications` → Fetch all applications
* `POST /applications` → Add new application (+ optional file upload)
* `PUT /applications/<id>` → Update application (+ optional file upload)
* `DELETE /applications/<id>` → Delete application

### Files

* `GET /applications/<id>/files` → Fetch files of an application
* `POST /upload/<application_id>` → Upload additional files
* `GET /media/<filename>` → Serve uploaded file

### Chatbot

* `POST /chatbot-stream`
  Request:

  ```json
  { "question": "Which jobs need follow-up?" }
  ```

  Response: Server-Sent Events (SSE) stream

---

##  Contributing

Contributions are welcome! Feel free to:

* Open issues for bugs/feature requests
* Submit pull requests

---

##  License

This project is licensed under the **MIT License**.

---

##  Future Enhancements

*  Authentication for user-specific job tracking
*  Advanced analytics (charts, statistics, trends)

---
