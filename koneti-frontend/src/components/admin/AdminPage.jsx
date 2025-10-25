import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faGlassMartiniAlt,
  faCalendarAlt,
  faPlus,
  faList,
  faEdit,
  faTrash,
  faEye,
  faSignOutAlt,
  faCheck,
  faTimes,
  faBriefcase,
  faGlassCheers,
} from "@fortawesome/free-solid-svg-icons";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

import "./AdminPage.scss";

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
  const [drinks, setDrinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarView, setCalendarView] = useState('month');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [stats, setStats] = useState({
    totalDrinks: 0,
    totalCategories: 0,
    totalReservations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);



  const fetchData = async () => {
    try {
      const [reservationsRes, drinksRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/reservations`),
        fetch(`${API_URL}/drinks`),
        fetch(`${API_URL}/categories`),
      ]);

      const reservations = await reservationsRes.json();
      const drinksData = await drinksRes.json();
      const categoriesData = await categoriesRes.json();

      const formattedEvents = reservations.map((e) => {
        const datePart = new Date(e.date);
        let startDate = new Date(datePart);
        if (e.time) {
          const [hours, minutes] = e.time.split(":");
          startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }
        return {
          ...e,
          title: `${e.name} (${e.type === 'koneti' ? 'Koneti Experience' : e.type === 'biznis' ? 'Biznis' : e.type})`,
          start: startDate,
          end: new Date(startDate.getTime() + 2 * 60 * 60 * 1000),
        };
      });

      setEvents(formattedEvents);
      setDrinks(drinksData);
      setCategories(categoriesData);
      setStats({
        totalDrinks: drinksData.length,
        totalCategories: categoriesData.length,
        totalReservations: reservations.length,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleReservationAction = async (reservationId, action) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });
      
      if (response.ok) {
        fetchData();
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };
  return (
    <div className="admin-dashboard">
      <main className="admin-main">
        {loading ? (
          <div className="admin-loading">
            <img src="/koneti-logo.png" alt="Koneti Logo" className="logo-bounce" />
          </div>
        ) : (
          <motion.div 
            className="dashboard-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faGlassMartiniAlt} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalDrinks}</h3>
                <p>Ukupno pića</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faList} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalCategories}</h3>
                <p>Kategorije</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalReservations}</h3>
                <p>Rezervacije</p>
              </div>
            </div>
          </div>

          <div className="action-cards">
            <div className="action-card" onClick={() => window.location.href = '/menu-management'}>
              <FontAwesomeIcon icon={faGlassMartiniAlt} />
              <h3>Upravljaj menijem</h3>
              <p>Upravljanje stavkama u meniju</p>
            </div>
            <div className="action-card" onClick={() => {
              setShowModal("calendar");
            }}>
              <FontAwesomeIcon icon={faCalendarAlt} />
              <h3>Kalendar</h3>
              <p>Pregled rezervacija</p>
            </div>

            <div className="action-card logout-card" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <h3>Odjavi se</h3>
              <p>Izađi iz admin panela</p>
            </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Calendar Modal */}
      {showModal === "calendar" && (
        <div className="modal-overlay blur-backdrop" onClick={() => setShowModal(null)}>
          <div className="modal-content fullscreen-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Kalendar rezervacija</h3>
              <button onClick={() => setShowModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="calendar-wrapper">
                <div style={{ marginBottom: '1rem', color: '#666' }}>
                  Ukupno događaja: {events.length}
                </div>
                <div style={{ height: '600px' }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={(event) => setSelectedEvent(event)}
                    views={['month', 'week', 'day', 'agenda']}
                    view={calendarView}
                    onView={(view) => setCalendarView(view)}
                    date={calendarDate}
                    onNavigate={(date) => setCalendarDate(date)}
                  />
                </div>
              </div>
              

            </div>
          </div>
        </div>
      )}

      {/* Event Details Panel */}
      {selectedEvent && (
        <div className="modal-overlay blur-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className={`event-details-panel ${selectedEvent.type === 'koneti' ? `${selectedEvent.subType || 'basic'}-package` : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="event-header">
              <FontAwesomeIcon 
                icon={selectedEvent.type === 'biznis' ? faBriefcase : faGlassCheers} 
                className="event-icon"
              />
              <h4>{selectedEvent.name}</h4>
              <button className="close-event" onClick={() => setSelectedEvent(null)}>×</button>
            </div>
            <div className="event-body">
              <div className="event-info">
                <p><strong>Tip:</strong> {selectedEvent.type === 'biznis' ? 'Biznis sastanak' : selectedEvent.type === 'koneti' ? `Koneti Experience - ${selectedEvent.subType ? selectedEvent.subType.charAt(0).toUpperCase() + selectedEvent.subType.slice(1) : 'Basic'}` : selectedEvent.type}</p>
                <p><strong>Email:</strong> {selectedEvent.email}</p>
                <p><strong>Telefon:</strong> {selectedEvent.phone}</p>
                <p><strong>Datum:</strong> {new Date(selectedEvent.date).toLocaleDateString("sr-RS")}</p>
                <p><strong>Vreme:</strong> {selectedEvent.time}</p>
                <p><strong>Gosti:</strong> {selectedEvent.guests}</p>
                {selectedEvent.selectedMenu && (
                  <p><strong>Meni:</strong> {selectedEvent.selectedMenu}</p>
                )}
                {selectedEvent.message && (
                  <p><strong>Poruka:</strong> {selectedEvent.message}</p>
                )}
              </div>
              <div className="event-actions">
                <button 
                  className="btn-approve"
                  onClick={() => handleReservationAction(selectedEvent._id, 'approved')}
                >
                  <FontAwesomeIcon icon={faCheck} /> Potvrdi
                </button>
                <button 
                  className="btn-reject"
                  onClick={() => handleReservationAction(selectedEvent._id, 'rejected')}
                >
                  <FontAwesomeIcon icon={faTimes} /> Odbij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}