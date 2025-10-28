"use client";

import React, { useEffect, useState } from "react";
import EventStats from "@/components/statistics/EventStats";
import { ProtectedRoute } from "@/contexts/ProtectedRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function EventStatsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/reservations`, { credentials: "include" });
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <EventStats events={events} />
    </ProtectedRoute>
  );
}
