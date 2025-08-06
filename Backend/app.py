from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
import mysql.connector
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# MySQL connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="job_tracker"
)
cursor = conn.cursor(dictionary=True)

# Get all applications
@app.route("/applications", methods=["GET"])
def get_applications():
    cursor.execute("SELECT * FROM applications ORDER BY date_applied DESC")
    return jsonify(cursor.fetchall())

# Create a new application
@app.route("/applications", methods=["POST"])
def add_application():
    data = request.form.to_dict()

    query = """
        INSERT INTO applications
        (job_id, date_applied, company, job_title, source, job_link,
         status, follow_up_date, notes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        data.get("job_id"),
        data.get("date_applied") or None,
        data.get("company"),
        data.get("job_title"),
        data.get("source"),
        data.get("job_link"),
        data.get("status"),
        data.get("follow_up_date") or None,
        data.get("notes")
    )
    cursor.execute(query, values)
    conn.commit()

    app_id = cursor.lastrowid
    job_id = data.get("job_id", "")

    # Handle file upload if any
    if 'media_file' in request.files:
        files = request.files.getlist("media_file")
        for file in files:
            if file.filename:
                original_name = secure_filename(file.filename)
                name, ext = os.path.splitext(original_name)
                new_filename = f"{name} {job_id}{ext}"
                file_path = os.path.join(app.config["UPLOAD_FOLDER"], new_filename)
                file.save(file_path)

                cursor.execute(
                    "INSERT INTO application_files (application_id, filename) VALUES (%s, %s)",
                    (app_id, new_filename)
                )
    conn.commit()
    return jsonify({"message": "Application added", "id": app_id}), 201

# Update application
@app.route("/applications/<int:id>", methods=["PUT"])
def update_application(id):
    data = request.form.to_dict()

    query = """
        UPDATE applications SET job_id=%s, date_applied=%s, company=%s, job_title=%s, source=%s,
        job_link=%s, status=%s, follow_up_date=%s, notes=%s WHERE id=%s
    """
    values = (
        data.get("job_id"),
        data.get("date_applied") or None,
        data.get("company"),
        data.get("job_title"),
        data.get("source"),
        data.get("job_link"),
        data.get("status"),
        data.get("follow_up_date") or None,
        data.get("notes"),
        id
    )
    cursor.execute(query, values)

    job_id = data.get("job_id", "")

    # Handle new files if uploaded
    if 'media_file' in request.files:
        files = request.files.getlist("media_file")
        for file in files:
            if file.filename:
                original_name = secure_filename(file.filename)
                name, ext = os.path.splitext(original_name)
                new_filename = f"{name} {job_id}{ext}"
                file_path = os.path.join(app.config["UPLOAD_FOLDER"], new_filename)
                file.save(file_path)

                cursor.execute(
                    "INSERT INTO application_files (application_id, filename) VALUES (%s, %s)",
                    (id, new_filename)
                )
    conn.commit()
    return jsonify({"message": "Application updated"})

# Delete application + cascade deletes associated files (DB handles it)
@app.route("/applications/<int:id>", methods=["DELETE"])
def delete_application(id):
    cursor.execute("DELETE FROM applications WHERE id = %s", (id,))
    conn.commit()
    return jsonify({"message": "Application deleted"})

# Fetch list of uploaded files per application
@app.route("/applications/<int:id>/files", methods=["GET"])
def get_application_files(id):
    cursor.execute("SELECT id, filename FROM application_files WHERE application_id = %s", (id,))
    return jsonify(cursor.fetchall())

# Serve file by filename
@app.route("/media/<filename>")
def get_media_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Upload additional files
@app.route("/upload/<int:application_id>", methods=["POST"])
def upload_files(application_id):
    if 'media_file' not in request.files:
        return jsonify({"error": "No files provided"}), 400

    # Fetch job_id from DB for naming
    cursor.execute("SELECT job_id FROM applications WHERE id = %s", (application_id,))
    result = cursor.fetchone()
    if not result:
        return jsonify({"error": "Application not found"}), 404

    job_id = result["job_id"]
    files = request.files.getlist("media_file")
    uploaded = []

    for file in files:
        if file.filename:
            original_name = secure_filename(file.filename)
            name, ext = os.path.splitext(original_name)
            new_filename = f"{name} {job_id}{ext}"
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], new_filename)
            file.save(file_path)

            cursor.execute(
                "INSERT INTO application_files (application_id, filename) VALUES (%s, %s)",
                (application_id, new_filename)
            )
            uploaded.append(new_filename)

    conn.commit()
    return jsonify({"uploaded_files": uploaded}), 200


#Chatbot

import google.generativeai as genai

genai.configure(api_key="AIzaSyAQ7QjL1x5y5najnt1UEw_43gdMsokq5iM")

@app.route("/chatbot-stream", methods=["POST"])
def chatbot_stream():
    question = request.json.get("question", "").strip()

    # Get job data to provide context
    cursor.execute("""
        SELECT job_id, company, job_title, status, date_applied, follow_up_date
        FROM applications
        ORDER BY date_applied DESC
    """)
    rows = cursor.fetchall()
    job_text = "\n".join([
        f"{r['job_id']}: {r['company']} - {r['job_title']} ({r['status']}) [Applied: {r['date_applied']}, Follow-up: {r['follow_up_date']}]"
        for r in rows
    ])

    prompt = f"""
You are a helpful assistant. Based on the following job application data:

{job_text}

Answer this user question: "{question}"
"""

    def generate():
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            stream = model.generate_content(prompt, stream=True)
            for chunk in stream:
                if chunk.text:
                    yield f"data: {chunk.text}\n\n"
        except Exception as e:
            yield f"data: ❌ Error: {str(e)}\n\n"

    return Response(generate(), mimetype="text/event-stream")

if __name__ == "__main__":
    app.run(debug=True)
