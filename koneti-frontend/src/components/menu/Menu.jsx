import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  faSearch,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "./Menu.scss";

const API_URL = import.meta.env.VITE_API_URL;

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
  const { i18n, t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [drinksLoading, setDrinksLoading] = useState(true);
  const itemsPerPage = 8;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0]._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch drinks
  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const res = await fetch(`${API_URL}/drinks`);
        const data = await res.json();
        setDrinks(data);
        setDrinksLoading(false);
      } catch (err) {
        console.error(err);
        setDrinksLoading(false);
      }
    };
    fetchDrinks();
  }, []);

  // Handle window resize for mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset page on category change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const activeCategory = selectedCategory || categories[0]?._id || "";
  const activeCategoryObj = categories.find(
    (cat) => cat._id === activeCategory
  );

  // Filter and sort drinks
  const categoryDrinks = drinks
    .filter((d) => d.category?._id === activeCategory)
    .filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(categoryDrinks.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDrinks = categoryDrinks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Helper to get category name with i18n support
  const getCategoryName = (cat) => {
    if (!cat) return "";
    return typeof cat.name === "object"
      ? cat.name[i18n.language] ?? cat.name.en
      : cat.name;
  };

  return (
    <div className="drink-menu-layout">
      {/* Sidebar desktop */}
      {!isMobile && (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-logo">
            <img
              src="/koneti-logo.png"
              alt="Koneti Logo"
              className="logo-img"
            />
          </div>

          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FontAwesomeIcon
              icon={collapsed ? faChevronRight : faChevronLeft}
            />
          </button>

          <div className="sidebar-title">
            {activeCategoryObj
              ? getCategoryName(activeCategoryObj)
              : t("menu.title")}
          </div>

          <div className="category-list">
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-btn ${
                  activeCategory === cat._id ? "active" : ""
                }`}
                data-tooltip={getCategoryName(cat)}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.icon && (
                  <FontAwesomeIcon
                    icon={faIconsMap[cat.icon]}
                    className="icon"
                  />
                )}
                <span>{getCategoryName(cat)}</span>
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* Main content */}
      <motion.main
        key={activeCategory + currentPage}
        className="drink-content"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Mobile categories */}
        {isMobile && (
          <div className="mobile-category-grid">
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-btn ${
                  activeCategory === cat._id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat._id)}
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

        {/* Dynamic content title */}
        <h2 className="content-title">
          <span className="highlight">
            {activeCategoryObj
              ? getCategoryName(activeCategoryObj)
              : t("menu.title")}
          </span>
        </h2>

        {/* Search */}
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={t("menu.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sorting */}
        <div className="filter-container">
          <FontAwesomeIcon icon={faSort} className="filter-icon" />
          <label className="filter-label">{t("menu.sortLabel")}</label>
          <select
            className="filter-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">{t("menu.sortOptions.name")}</option>
            <option value="price-low">{t("menu.sortOptions.priceLow")}</option>
            <option value="price-high">
              {t("menu.sortOptions.priceHigh")}
            </option>
          </select>
        </div>

        {/* Drinks grid */}
        <div className="drinks-grid">
          {drinksLoading ? (
            <div className="drinks-loading">
              <img
                src="/koneti-logo.png"
                alt="Koneti Logo"
                className="logo-bounce"
              />
            </div>
          ) : (
            currentDrinks.map((drink) => (
              <motion.div
                key={drink._id}
                className="drink-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="image-container">
                  {drink.image && (
                    <img
                      src={drink.image}
                      alt={drink.name}
                      className="drink-img"
                    />
                  )}
                </div>
                <div className="card-content">
                  <h3>{drink.name}</h3>
                  <div className="price">
                    {drink.price} {t("menu.currency")}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {categoryDrinks.length > itemsPerPage && (
          <div className="pagination-controls">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              {t("menu.pagination.prev")}
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              {t("menu.pagination.next")}
            </button>
          </div>
        )}
      </motion.main>
    </div>
  );
}
