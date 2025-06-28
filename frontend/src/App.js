

// src/App.js
import React, { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import { FaMagic, FaPlus, FaMinus, FaSave, FaDownload, FaPrint, FaLightbulb, FaRobot } from "react-icons/fa";

function App() {
  const [resume, setResume] = useState({
    name: "",
    summary: "",
    experience: [""],
    education: [""],
    skills: [""],
    projects: [""],
    certifications: [""],
    hobbies: [""],
  });

  const [jobRole, setJobRole] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const printRef = useRef();

  const handleChange = (field, value, index = null) => {
    if (Array.isArray(resume[field])) {
      const updated = [...resume[field]];
      updated[index] = value;
      setResume({ ...resume, [field]: updated });
    } else {
      setResume({ ...resume, [field]: value });
    }
  };

  const handleAdd = (field) => {
    setResume({ ...resume, [field]: [...resume[field], ""] });
  };

  const handleRemove = (field, index) => {
    const updated = [...resume[field]];
    updated.splice(index, 1);
    setResume({ ...resume, [field]: updated });
  };

  const enhanceSection = async (field, content) => {
    try {
      const res = await axios.post("http://localhost:8000/ai-enhance", {
        section: field,
        content,
      });
      const enhanced = res.data.enhanced_content;

      if (Array.isArray(resume[field])) {
        const updated = [...resume[field]];
        updated[0] = enhanced;
        setResume({ ...resume, [field]: updated });
      } else {
        setResume({ ...resume, [field]: enhanced });
      }
    } catch (err) {
      toast.error("Enhancement failed");
    }
  };

  const saveResume = async () => {
    try {
      await axios.post("http://localhost:8000/save-resume", resume);
      toast.success("Resume saved!");
    } catch (err) {
      toast.error("Saving failed");
    }
  };

  const downloadResume = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.json";
    a.click();
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Resume",
  });

  const suggestSkills = async () => {
    try {
      const res = await axios.post("http://localhost:8000/ai-enhance", {
        section: "skills",
        content: jobRole,
      });
      setResume({ ...resume, skills: res.data.enhanced_content.split(", ") });
      toast.success("AI suggested skills added!");
    } catch (err) {
      toast.error("Failed to fetch skills");
    }
  };

  const autoGenerateResume = async () => {
    try {
      const res = await axios.get("http://localhost:8000/generate-resume", {
        params: { job_title: jobRole || "Software Developer" },
      });
      setResume(res.data);
      toast.success("AI-generated resume loaded!");
    } catch {
      toast.error("Auto-generation failed");
    }
  };

  return (
    <div className="container">
      <h2>Resume Editor</h2>

      <div className="section">
        <label>Name:</label>
        <input
          type="text"
          value={resume.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <button onClick={() => enhanceSection("name", resume.name)}><FaMagic /> Enhance</button>
      </div>

      <div className="section">
        <label>Summary:</label>
        <textarea
          value={resume.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
        />
        <button onClick={() => enhanceSection("summary", resume.summary)}><FaMagic /> Enhance</button>
      </div>

      <div className="section">
        <label>Profile Picture:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                setProfilePic(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {profilePic && (
          <img
            src={profilePic}
            alt="Profile"
            style={{ height: "100px", borderRadius: "50%", marginTop: "10px" }}
          />
        )}
      </div>

      {[
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "hobbies",
      ].map((field) => (
        <div key={field} className="section">
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
          {resume[field].map((val, idx) => (
            <div key={idx}>
              <input
                type="text"
                value={val}
                onChange={(e) => handleChange(field, e.target.value, idx)}
              />
              <button onClick={() => enhanceSection(field, val)}><FaMagic /></button>
              <button onClick={() => handleRemove(field, idx)}><FaMinus /></button>
            </div>
          ))}
          <button onClick={() => handleAdd(field)}><FaPlus /> Add {field}</button>
        </div>
      ))}

      <div className="section">
        <label>Job Role (for AI suggestions):</label>
        <input type="text" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
        <button onClick={suggestSkills}><FaLightbulb /> Suggest Skills</button>
        <button onClick={autoGenerateResume}><FaRobot /> Auto-Generate Resume</button>
      </div>

      <div className="buttons">
        <button onClick={saveResume}><FaSave /> Save Resume</button>
        <button onClick={downloadResume}><FaDownload /> Download JSON</button>
        <button onClick={handlePrint}><FaPrint /> Export to PDF</button>
      </div>

      <ToastContainer />
      <div style={{ display: "none" }} ref={printRef}>
        <h1>{resume.name}</h1>
        <p>{resume.summary}</p>
        {profilePic && <img src={profilePic} alt="Profile" height="100" />}
        <ul>
          {Object.keys(resume).map((key) => (
            Array.isArray(resume[key]) && (
              <li key={key}>
                <strong>{key.toUpperCase()}</strong>
                <ul>
                  {resume[key].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
