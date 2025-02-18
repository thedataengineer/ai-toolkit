"use client"; // Required for React hooks in Next.js App Router

import { useState } from "react";

export default function Home() {
  const [role, setRole] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [taskUpdates, setTaskUpdates] = useState("");
  const [standupReport, setStandupReport] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStandup = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-standup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, clientName, projectName, taskUpdates }),
      });
      const data = await res.json();
      setStandupReport(data.report || "Failed to generate report.");
    } catch (error) {
      console.error("Error fetching AI report:", error);
      setStandupReport("Error generating report.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      borderRadius: "10px"
    }}>
      <h1 style={{ textAlign: "center", fontSize: "22px" }}>AI Toolkit - Stand-Up Generator</h1>

      {/* Role Selection */}
      <label style={{ fontWeight: "bold" }}>Role</label>
      <select
        style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Select Role</option>
        <option value="Developer">Developer</option>
        <option value="QA">QA</option>
        <option value="BSA">BSA</option>
        <option value="DevOps">DevOps</option>
        <option value="Sales">Sales</option>
        <option value="STAG">STAG</option>
        <option value="BU Head">BU Head</option>
        <option value="Exec">Exec</option>
      </select>

      {/* Client Name */}
      <label style={{ fontWeight: "bold" }}>Client Name</label>
      <input
        type="text"
        style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        placeholder="e.g., LabCorp"
      />

      {/* Project Name */}
      <label style={{ fontWeight: "bold" }}>Project Name</label>
      <input
        type="text"
        style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="e.g., AI Transformation"
      />

      {/* Task Updates */}
      <label style={{ fontWeight: "bold" }}>Task Updates</label>
      <textarea
        style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        value={taskUpdates}
        onChange={(e) => setTaskUpdates(e.target.value)}
        placeholder="Describe your updates..."
        rows="4"
      />

      {/* Generate Button */}
      <button
        onClick={generateStandup}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "5px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        {loading ? "Generating..." : "Generate My Stand-Up"}
      </button>

      {/* Stand-Up Report Output */}
      {standupReport && (
        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
          <p><strong>Generated Stand-Up Report:</strong></p>
          <p>{standupReport}</p>
        </div>
      )}
    </div>
  );
}
