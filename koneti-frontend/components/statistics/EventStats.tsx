"use client";
import React, { useMemo } from "react";
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
import "./EventStats.scss";

interface Event {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  status: "approved" | "pending" | "rejected" | "cancelled";
  user?: string;
}

interface Props {
  events: Event[];
}

const COLORS = {
  approved: "#7ecb89",
  pending: "#f6c667",
  rejected: "#e86a6a",
  cancelled: "#b7b7b7",
};

const EventStats: React.FC<Props> = ({ events }) => {
  // 📅 Mesečna distribucija
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString("default", { month: "short" }),
      count: 0,
    }));

    events.forEach((ev) => {
      const date = new Date(ev.start);
      const m = date.getMonth();
      if (!isNaN(m) && m >= 0 && m < 12) {
        months[m].count += 1;
      }
    });

    return months;
  }, [events]);

  // 🟢 Statuse rezervacija
  const statusData = useMemo(() => {
    const stats = { approved: 0, pending: 0, rejected: 0, cancelled: 0 };
    events.forEach((ev) => {
      const key = ev.status as keyof typeof stats;
      stats[key] = (stats[key] || 0) + 1;
    });

    return Object.keys(stats).map((key) => ({
      name: key,
      value: stats[key as keyof typeof stats],
    }));
  }, [events]);

  // ⏰ Prosečno trajanje događaja
  const avgDuration = useMemo(() => {
    if (events.length === 0) return 0;

    const totalMinutes = events.reduce((sum, ev) => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return sum;
      const diff = (end.getTime() - start.getTime()) / 60000;
      return sum + Math.max(diff, 0);
    }, 0);

    return Math.round(totalMinutes / events.length);
  }, [events]);

  // 🚫 Broj otkazanih događaja
  const cancelledCount = useMemo(
    () => events.filter((ev) => ev.status === "cancelled").length,
    [events]
  );

  // 👥 Najčešći korisnici
  const topUsers = useMemo(() => {
    const userMap: Record<string, number> = {};
    events.forEach((ev) => {
      if (ev.user) userMap[ev.user] = (userMap[ev.user] || 0) + 1;
    });

    return Object.entries(userMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [events]);

  return (
    <div className="event-stats">
      <h2>📊 Statistika rezervacija / događaja</h2>

      <div className="stats-grid">
        {/* 📅 Broj rezervacija po mesecu */}
        <div className="stat-card wide">
          <h3>Broj rezervacija po mesecu</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#cfa68a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🟢 Status rezervacija */}
        <div className="stat-card">
          <h3>Status rezervacija</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={({ name, value }) => `${name} (${value})`}
              >
                {statusData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ⏱ KPI Kartice */}
        <div className="stat-card small">
          <h3>Prosečno trajanje</h3>
          <div className="kpi-value">{avgDuration} min</div>
        </div>

        <div className="stat-card small">
          <h3>Otkazane rezervacije</h3>
          <div className="kpi-value">{cancelledCount}</div>
        </div>

        {/* 👤 Top korisnici */}
        <div className="stat-card wide">
          <h3>Najčešći korisnici</h3>
          <ul className="user-list">
            {topUsers.map((u) => (
              <li key={u.name}>
                <span>{u.name}</span>
                <span>{u.count} rezervacija</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventStats;
