import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

type Welcome = { message: string; status: string };

function App() {
  const [data, setData] = useState<null | Welcome>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/auth/test")
      .then((res) => res.json())
      .then((json: Welcome) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>React + Elysia Test</h1>
      <hr />
      {loading ? (
        <p>Sedang memuat data...</p>
      ) : (
        <div
          style={{
            background: "#f0f0f0",
            padding: "10px",
            borderRadius: "8px",
          }}>
          <p>
            <strong>Pesan dari API:</strong> {data?.message}
          </p>
          <p>
            <strong>Status:</strong> {data?.status}
          </p>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
