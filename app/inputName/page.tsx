"use client";

import { useState, useEffect } from "react";

export default function InputNamePage() {
  const [name, setName] = useState("");
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    const storedNames = localStorage.getItem("names");
    if (storedNames) {
      setNames(JSON.parse(storedNames));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("names", JSON.stringify(names));
  }, [names]);

  const handleAddName = () => {
    if (name.trim() !== "" && !names.includes(name)) {
      setNames([...names, name]);
      setName("");
    }
  };

  const handleDeleteName = (nameToRemove: string) => {
    const updatedNames = names.filter((n) => n !== nameToRemove);
    setNames(updatedNames);
  };

  return (
    <div>
      <h1>Enter a Name</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name"
          style={{ padding: "5px", width: "200px" }}
        />
        <button onClick={handleAddName} style={{ padding: "5px 10px" }}>
          Add
        </button>
      </div>

      <h2>Stored Names:</h2>
      <ul>
        {names.map((n, index) => (
          <li key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {n}
            <button onClick={() => handleDeleteName(n)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
