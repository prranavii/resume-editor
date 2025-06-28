##📝 Resume Editor Web App

A web-based Resume Editor that allows users to upload, edit, enhance, and download their resumes. Built with **React.js** on the frontend and **FastAPI** on the backend.

---

## 🚀 Features

### ✅ Frontend (React.js)

* **Upload Resume**: Accepts `.pdf` or `.docx` files (mock parsing with dummy content)
* **Edit Resume**: Editable fields for name, summary, experience, education, skills, projects, certifications, hobbies
* **Enhance with AI**: Each section has an "Enhance" button which calls the backend and shows an improved version
* **Save Resume**: Sends resume JSON to backend (`/save-resume`) and saves it
* **Download**: Download the resume as `.json` or `.pdf`
* **Auto Suggestions**: Suggest skills based on job role input
* **Generate Resume**: Auto-generate a sample resume using job role input

### ✅ Backend (FastAPI)

* `POST /ai-enhance`: Returns a mocked improved version of a given resume section
* `POST /save-resume`: Saves full resume JSON to a file
* `GET /generate-resume`: Returns an auto-generated resume based on a job title

---


## ⚙️ Setup Instructions

### 🔹 Backend (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # On Windows
pip install fastapi uvicorn
uvicorn main:app --reload
```

API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 🔹 Frontend (React)

```bash
cd frontend
npm install
npm start
```

App runs at [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

* **Frontend**: React.js, React Icons, React Toastify, React-to-Print
* **Backend**: FastAPI, Pydantic
* **Styling**: CSS (custom)

---

## 🙋‍♀️ Author

**Pranavi Jain**


---

## 📄 License

This project is for educational purposes and internship evaluation. Not intended for commercial use.
