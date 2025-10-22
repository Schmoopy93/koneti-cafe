import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faGlassWhiskey,
  faCocktail,
  faWineGlassAlt,
  faBeer,
  faMugHot,
  faWineBottle,
  faGlassMartiniAlt,
  faGlassCheers,
  faGlassWater,
  faBlender,
  faBottleDroplet,
  faChampagneGlasses,
  faIceCream,
  faLemon,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "./Menu.scss";

const API_URL = import.meta.env.VITE_API_URL;

// Mapiranje string naziva ikonice -> FA icon
const faIconsMap = {
  faCoffee,
  faGlassWhiskey,
  faCocktail,
  faWineGlassAlt,
  faBeer,
  faMugHot,
  faWineBottle,
  faGlassMartiniAlt,
  faGlassCheers,
  faGlassWater,
  faBlender,
  faBottleDroplet,
  faChampagneGlasses,
  faIceCream,
  faLemon,
};

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [collapsed, setCollapsed] = useState(false);
  const itemsPerPage = 8;

  // === Fetch categories ===
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json(); // [{_id, name, icon}]
        setCategories(data);
        setSelectedCategory(data[0]?._id || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // === Fetch drinks ===
  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const res = await fetch(`${API_URL}/drinks`);
        if (!res.ok) throw new Error("Failed to fetch drinks");
        const data = await res.json();
        setDrinks(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDrinks();
  }, []);

  // === Handle resize for mobile ===
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter pića po selektovanoj kategoriji
  const categoryDrinks = drinks.filter(
    (d) => d.category?._id === selectedCategory
  );
  const totalPages = Math.ceil(categoryDrinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDrinks = categoryDrinks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="drink-menu-layout">
      {/* Sidebar za desktop */}
      {!isMobile && (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FontAwesomeIcon
              icon={collapsed ? faChevronRight : faChevronLeft}
            />
          </button>

          <div className="sidebar-title">Kategorije</div>
          <div className="category-list">
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-btn ${
                  selectedCategory === cat._id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  setCurrentPage(1);
                }}
              >
                {cat.icon && (
                  <FontAwesomeIcon
                    icon={faIconsMap[cat.icon]}
                    className="icon"
                  />
                )}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* Glavni content */}
      <motion.main
        key={selectedCategory + currentPage}
        className="drink-content"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Mobile kategorije */}
        {isMobile && (
          <div className="mobile-category-grid">
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-btn ${
                  selectedCategory === cat._id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  setCurrentPage(1);
                }}
              >
                {cat.icon && (
                  <FontAwesomeIcon
                    icon={faIconsMap[cat.icon]}
                    className="icon"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        <h2 className="content-title">
          {categories.find((c) => c._id === selectedCategory)?.name}
        </h2>

        <div className="drinks-grid">
          {currentDrinks.map((drink) => (
            <motion.div
              key={drink._id}
              className="drink-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3>{drink.name}</h3>
              <p className="price">{drink.price}</p>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Prev
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </motion.main>
    </div>
  );
}
