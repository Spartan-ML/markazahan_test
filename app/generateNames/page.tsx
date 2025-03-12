"use client";

import { useEffect, useState, useCallback } from "react";

const generateRandomName = (): string => {
  const firstNames = ["John", "Jane", "Alex", "Chris", "Sam", "Kelly", "Taylor", "Jordan"];
  const lastNames = ["Smith", "Johnson", "Brown", "Williams", "Jones", "Miller", "Davis", "Garcia"];

  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${randomFirstName} ${randomLastName}`;
};

export default function GenerateNamesPage() {
  const [names, setNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  // Function to load more names
  const loadMoreNames = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    const newNames = Array.from({ length: 1000 }, () => generateRandomName());
    
    setNames((prevNames) => [...prevNames, ...newNames]);
    setLoading(false);
    setHasMore(newNames.length > 0);  // This can be adjusted depending on your logic
  }, [loading, hasMore]);

  // Intersection Observer to detect when user scrolls to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreNames();
        }
      },
      { threshold: 1.0 }
    );

    const target = document.querySelector("#loadMoreTrigger");
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loadMoreNames, hasMore]);

  useEffect(() => {
    loadMoreNames(); // Initial load
  }, [loadMoreNames]);

  return (
    <div>
      <h1>Generated Names</h1>
      <p>Scroll down to load more names.</p>
      <ul>
        {names.map((name, index) => (
          <li key={index} style={{ padding: "10px", marginBottom: "5px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
            {name}
          </li>
        ))}
      </ul>

      {loading && <p>Loading...</p>}

      {/* This is the trigger point for the intersection observer */}
      <div id="loadMoreTrigger" style={{ height: "20px" }}></div>
    </div>
  );
}
