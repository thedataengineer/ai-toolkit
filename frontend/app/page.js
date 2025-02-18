export default async function Home() {
  let data = "Loading...";

  try {
    const res = await fetch("http://localhost:5001/", { cache: "no-store" }); // Calls backend API
    data = await res.text();
  } catch (error) {
    console.error("Error fetching data from backend:", error);
    data = "Failed to load data from backend.";
  }

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Frontend Connected to Backend</h1>
      <p>{data}</p>
    </div>
  );
}
