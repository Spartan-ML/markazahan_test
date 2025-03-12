"use client";

import { useState, useEffect } from "react";

export default function ListStoredNamesPage() {
  const [names, setNames] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Fetch stored names from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedNames = localStorage.getItem("names");
      if (storedNames) {
        setNames(JSON.parse(storedNames));
      }
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    // If the dragged item is dropped on itself, do nothing
    if (draggedIndex === null || draggedIndex === index) {
      return;
    }

    // Reorder the names array
    const updatedNames = [...names];
    const [draggedName] = updatedNames.splice(draggedIndex, 1);
    updatedNames.splice(index, 0, draggedName);

    // Update the state and localStorage with the new order
    setNames(updatedNames);
    localStorage.setItem("names", JSON.stringify(updatedNames));

    // Reset the dragged index
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div>
      <h1>Stored Names</h1>

      {names.length === 0 ? (
        <p>No names stored.</p>
      ) : (
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          {names.map((name, index) => (
            <li
              key={name}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                padding: "10px",
                margin: "5px 0",
                backgroundColor: "#f4f4f4",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "move",
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
