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
  const [openCalendar, setOpenCalendar] = useState(true); // kalendar
  const [openForm, setOpenForm] = useState(false); // forma
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const toggleCalendar = () => {
    setOpenCalendar((prev) => {
      if (!prev) setOpenForm(false); // zatvori formu ako je kalendar otvaran
      return !prev;
    });
  };

  const toggleForm = () => {
    setOpenForm((prev) => {
      if (!prev) setOpenCalendar(false); // zatvori kalendar ako se forma otvara
      return !prev;
    });
  };

  return (
    <div className="admin-page-wrapper">
      <div className="calendar-dropdown-wrapper">
        <button className="gradient-btn" onClick={toggleCalendar}>
          {openCalendar ? "Zatvori kalendar" : "Prikaži kalendar"}
        </button>

        <button
          className="gradient-btn"
          onClick={toggleForm}
          style={{ marginLeft: "1rem" }}
        >
          {openForm ? "Zatvori Dodaj u meni" : "Dodaj u meni"}
        </button>

        {/* Forma */}
        {openForm && (
          <div className="add-drink-form-wrapper">
            <AddDrink onClose={() => setOpenForm(false)} />
          </div>
        )}

        {/* Kalendar */}
        {openCalendar && (
          <div className={`calendar-container ${!openCalendar ? "collapsed" : ""}`}>
            <div className="calendar-inner">
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
          </div>
        )}

        {/* Modal za detalje eventa */}
        {selectedEvent && (
          <div className="event-details-overlay">
            <div className="event-details-card">
              <button
                className="close-icon-btn"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>

              <h3>{selectedEvent.name}</h3>
              <p>
                <strong>Tip:</strong>
                {selectedEvent.type === "biznis"
                  ? " Biznis sastanak"
                  : selectedEvent.type === "proslava"
                  ? " Proslava"
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
                <strong>Datum:</strong>{" "}
                {new Date(selectedEvent.date).toLocaleDateString("sr-RS")}
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
    </div>
  );
}
