import { createRoot } from "react-dom/client";
import clarity from "@microsoft/clarity";
import App from "./App.tsx";
import "./index.css";

clarity.init("xdych1gxkq");

createRoot(document.getElementById("root")!).render(<App />);
