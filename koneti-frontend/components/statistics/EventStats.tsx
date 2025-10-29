  "use client";
  import React, { useEffect, useState, useMemo } from "react";
  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
  } from "recharts";
  import { useTranslation } from "react-i18next";
  import "./EventStats.scss";

  interface Event {
    _id: string;
    name: string;
    email: string;
    phone: string;
    date: string | Date;
    time: string;
    guests: number;
    status: "approved" | "pending" | "rejected" | "cancelled";
    createdAt?: string;
    updatedAt?: string;
  }

  const COLORS = {
    approved: "#7ecb89",
    pending: "#f6c667",
    rejected: "#e86a6a",
    cancelled: "#b7b7b7",
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const EventStats: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const res = await fetch(`${API_URL}/reservations`);
          if (!res.ok) throw new Error("Error loading data");
          const data = await res.json();
          setEvents(data);
        } catch {
          // optional: show toast
        } finally {
          setLoading(false);
        }
      };
      fetchEvents();
    }, []);

    const monthlyData = useMemo(() => {
      const months = Array.from({ length: 12 }, (_, i) => ({
        name: new Date(0, i).toLocaleString(i18n.language, { month: "short" }),
        count: 0,
      }));

      events.forEach((ev) => {
        if (!ev?.date) return;
        const date = new Date(ev.date);
        if (!isNaN(date.getTime())) {
          const m = date.getMonth();
          if (m >= 0 && m < 12) months[m].count += 1;
        }
      });

      return months;
    }, [events, i18n.language]);

    const statusData = useMemo(() => {
      const stats = { approved: 0, pending: 0, rejected: 0, cancelled: 0 };
      events.forEach((ev) => {
        const key = ev.status as keyof typeof stats;
        stats[key] = (stats[key] || 0) + 1;
      });

      return Object.keys(stats).map((key) => ({
        key,
        name: t(`eventStats.statuses.${key}`),
        value: stats[key as keyof typeof stats],
      }));
    }, [events, i18n.language]);

    if (loading) return <p>{t("eventStats.loading")}</p>;

    return (
      <div className="event-stats">
        <h2>{t("eventStats.title")}</h2>

        <div className="stats-grid">
          <div className="stat-card status-chart">
            <h3>{t("eventStats.statusTitle")}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={COLORS[entry.key as keyof typeof COLORS]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
                    <div className="stat-card wide">
            <h3>{t("eventStats.monthlyTitle")}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#cfa68a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  export default EventStats;
