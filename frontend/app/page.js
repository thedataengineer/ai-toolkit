import { useState } from "react";

export default function Home() {
  const [taskUpdates, setTaskUpdates] = useState("");
  const [standupReport, setStandupReport] = useState("");

  const generateStandup = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-standup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_updates: taskUpdates }),
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
      <textarea
        value={taskUpdates}
        onChange={(e) => setTaskUpdates(e.target.value)}
        placeholder="Enter your recent work updates..."
        rows="4" cols="50"
      />
      <br />
      <button onClick={generateStandup}>Generate My Stand-Up</button>
      <p><strong>Generated Stand-Up Report:</strong></p>
      <p>{standupReport}</p>
    </div>
  );
}
