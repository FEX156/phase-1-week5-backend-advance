import { createRoot } from "react-dom/client";

function App() {
  return (
    <main>
      <h2>this is example</h2>
    </main>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
