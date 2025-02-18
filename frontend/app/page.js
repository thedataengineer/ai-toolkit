"use client"; // Required for React hooks in Next.js App Router

import { useState } from "react";

export default function Home() {
  const [role, setRole] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [taskUpdates, setTaskUpdates] = useState("");
  const [standupReport, setStandupReport] = useState("");

  const generateStandup = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-standup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          clientName,
          projectName,
          taskUpdates
        }),
      });
      const data = await res.json();
      setStandupReport(data.report || "Failed to generate report.");
    } catch (error) {
      console.error("Error fetching AI report:", error);
      setStandupReport("Error generating report.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>AI Toolkit - Stand-Up Generator</h1>

      {/* Role Selection */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="role">Role: </label>
        <select
          id="role"
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
      </div>

      {/* Client Name */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="clientName">Client Name: </label>
        <input
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="e.g., Acme Corp"
        />
      </div>

      {/* Project Name */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="projectName">Project Name: </label>
        <input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g., AI Transformation"
        />
      </div>

      {/* Task Updates */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="taskUpdates">Task Updates: </label>
        <textarea
          id="taskUpdates"
          value={taskUpdates}
          onChange={(e) => setTaskUpdates(e.target.value)}
          placeholder="Enter your recent work updates..."
          rows="4"
          cols="50"
        />
      </div>

      <button onClick={generateStandup}>Generate My Stand-Up</button>

      <p><strong>Generated Stand-Up Report:</strong></p>
      <p>{standupReport}</p>
    </div>
  );
}
