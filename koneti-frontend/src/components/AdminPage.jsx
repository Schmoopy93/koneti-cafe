import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./AdminPage.scss";

import AddDrink from "./AddDrink";
import AddCategory from "./AddCategory";
import { FaCalendarAlt, FaGlassMartiniAlt, FaListAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;
const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openCategoryForm, setOpenCategoryForm] = useState(false);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/reservations`)
      .then((res) => res.json())
      .then((data) => {
        const formattedEvents = data.map((e) => {
          const datePart = new Date(e.date);
          let startDate = new Date(datePart);
          if (e.time) {
            const [hours, minutes] = e.time.split(":");
            startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          }
          return {
            ...e,
            title: `${e.name} (${e.type})`,
            start: startDate,
            end: new Date(startDate.getTime() + 2 * 60 * 60 * 1000),
          };
        });
        setEvents(formattedEvents);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="admin-page-wrapper">
      {/* ===== Sidebar ===== */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>

        <button
          className={`sidebar-btn ${openCalendar ? "active" : ""}`}
          onClick={() => {
            setOpenCalendar(true);
            setOpenForm(false);
            setOpenCategoryForm(false);
          }}
        >
          <FaCalendarAlt className="icon" />
          <span>Kalendar</span>
        </button>

        <button
          className={`sidebar-btn ${openForm ? "active" : ""}`}
          onClick={() => {
            setOpenCalendar(false);
            setOpenForm(true);
            setOpenCategoryForm(false);
          }}
        >
          <FaGlassMartiniAlt className="icon" />
          <span>Dodaj piće</span>
        </button>

        <button
          className={`sidebar-btn ${openCategoryForm ? "active" : ""}`}
          onClick={() => {
            setOpenCalendar(false);
            setOpenForm(false);
            setOpenCategoryForm(true);
          }}
        >
          <FaListAlt className="icon" />
          <span>Dodaj kategoriju</span>
        </button>
      </aside>

      {/* ===== Glavni sadržaj ===== */}
      <main className="admin-main">
        {openCalendar && (
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%", width: "100%" }}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              views={["month", "week", "day"]}
              onSelectEvent={(event) => setSelectedEvent(event)}
            />
          </div>
        )}

        {openForm && (
          <div className="form-wrapper">
            <AddDrink onClose={() => setOpenForm(false)} />
          </div>
        )}

        {openCategoryForm && (
          <div className="form-wrapper">
            <AddCategory onClose={() => setOpenCategoryForm(false)} />
          </div>
        )}
      </main>

      {/* ===== Modal detalja događaja ===== */}
      {selectedEvent && (
        <div className="event-details-overlay">
          <div className="event-details-card">
            <button className="close-icon-btn" onClick={() => setSelectedEvent(null)}>
              ×
            </button>
            <h3>{selectedEvent.name}</h3>
            <p>
              <strong>Tip:</strong>{" "}
              {selectedEvent.type === "biznis"
                ? "Biznis sastanak"
                : selectedEvent.type === "proslava"
                ? "Proslava"
                : selectedEvent.name}
            </p>
            {selectedEvent.subType && (
              <p>
                <strong>Podtip:</strong> {selectedEvent.subType}
              </p>
            )}
            <p>
              <strong>Email:</strong> {selectedEvent.email}
            </p>
            <p>
              <strong>Telefon:</strong> {selectedEvent.phone}
            </p>
            <p>
              <strong>Datum:</strong> {new Date(selectedEvent.date).toLocaleDateString("sr-RS")}
            </p>
            <p>
              <strong>Vreme:</strong> {selectedEvent.time}
            </p>
            <p>
              <strong>Broj gostiju:</strong> {selectedEvent.guests}
            </p>
            {selectedEvent.message && (
              <p>
                <strong>Poruka:</strong> {selectedEvent.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
