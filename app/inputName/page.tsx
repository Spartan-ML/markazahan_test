"use client";

import { useState, useEffect } from "react";

// Helper function to get data from localStorage
const getStoredNames = (): string[] => {
  if (typeof window !== "undefined") {
    const storedNames = localStorage.getItem("names");
    return storedNames ? JSON.parse(storedNames) : [];
  }
  return [];
};

export default function InputNamePage() {
  const [name, setName] = useState("");
  // Initialize the state with data from localStorage (if available)
  const [names, setNames] = useState<string[]>(getStoredNames);

  // Use effect to update localStorage whenever names change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("names", JSON.stringify(names));
    }
  }, [names]);

  // Function to handle name addition
  const handleAddName = () => {
    const trimmedName = name.trim();
    if (trimmedName !== "" && !names.includes(trimmedName)) {
      setNames((prevNames) => [...prevNames, trimmedName]);
      setName("");
    }
  };

  // Function to handle name deletion
  const handleDeleteName = (nameToRemove: string) => {
    setNames((prevNames) => prevNames.filter((n) => n !== nameToRemove));
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
          <li
            key={index}
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            {n}
            <button
              onClick={() => handleDeleteName(n)}
              style={{
                color: "red",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
