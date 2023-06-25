import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { Routes, Route } from "react-router-dom";
import { MemoryRouter as Router } from "react-router-dom";
import "./App.css";
import { Button } from "@/components";
import Home from "@/pages/Home/Home";
import { Player } from "@/pages/Player/Player";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="bg-transparent">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player" element={<Player />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
