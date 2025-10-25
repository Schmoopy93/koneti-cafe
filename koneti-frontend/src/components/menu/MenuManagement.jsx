import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEdit, faTrash, faPlus, faSearch, 
  faGlassMartiniAlt, faChevronLeft, faChevronRight, 
  faSort, faTag 
} from "@fortawesome/free-solid-svg-icons";
import "./MenuManagement.scss";

const API_URL = import.meta.env.VITE_API_URL;

export default function MenuManagement({ drinks: externalDrinks = [], categories: externalCategories = [], onAddDrink, onAddCategory, onEditDrink, onDeleteDrink, isLoading: externalLoading = false }) {
  const { t, i18n } = useTranslation();
  const language = i18n.language || "sr";

  const [categories, setCategories] = useState(externalCategories);
  const [drinks, setDrinks] = useState(externalDrinks);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(externalLoading);
  const itemsPerPage = 8;

  // Sync with external props provided by MenuManagementPage
  useEffect(() => {
    setCategories(externalCategories);
  }, [externalCategories]);

  useEffect(() => {
    setDrinks(externalDrinks);
  }, [externalDrinks]);

  useEffect(() => {
    setIsLoading(externalLoading);
  }, [externalLoading]);

  const deleteDrink = async (id) => {
    try {
      if (onDeleteDrink) {
        await onDeleteDrink(id);
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting drink:", error);
    }
  };

  const filteredDrinks = drinks
    .filter(drink => {
      const matchesCategory = selectedCategory === "all" || drink.category?._id === selectedCategory;
      const matchesSearch = drink.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredDrinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrinks = filteredDrinks.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="menu-management">
      <div className="management-header">
        <div className="search-section">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder={t('admin.menuManagement.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="category-tabs">
          <button
            className={selectedCategory === "all" ? "active" : ""}
            onClick={() => setSelectedCategory("all")}
          >
            {t('admin.menuManagement.allCategories')} ({drinks.length})
          </button>
          {categories.map(category => (
            <button
              key={category._id}
              className={selectedCategory === category._id ? "active" : ""}
              onClick={() => setSelectedCategory(category._id)}
            >
              {category.name?.[language] || category.name?.sr} ({drinks.filter(d => d.category?._id === category._id).length})
            </button>
          ))}
        </div>

        <div className="filter-container">
          <FontAwesomeIcon icon={faSort} className="filter-icon" />
          <label className="filter-label">{t('admin.menuManagement.sortLabel')}</label>
          <select
            className="filter-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">{t('admin.menuManagement.sortOptions.name')}</option>
            <option value="price-low">{t('admin.menuManagement.sortOptions.priceLow')}</option>
            <option value="price-high">{t('admin.menuManagement.sortOptions.priceHigh')}</option>
          </select>
        </div>

        <div className="action-buttons">
          <button className="btn-add-drink" onClick={onAddDrink}>
            <FontAwesomeIcon icon={faPlus} /> {t('admin.addDrink.addButton')}
          </button>
          <button className="btn-add-category" onClick={onAddCategory}>
            <FontAwesomeIcon icon={faTag} /> {t('admin.addCategory.addButton')}
          </button>
        </div>
      </div>

      <div className="drinks-section">
        <h3>
          <FontAwesomeIcon icon={faGlassMartiniAlt} style={{marginRight: '0.5rem'}} />
          {selectedCategory === "all"
            ? `${t('admin.menuManagement.allDrinks')} (${filteredDrinks.length})`
            : `${categories.find(c => c._id === selectedCategory)?.name?.[language] || categories.find(c => c._id === selectedCategory)?.name?.sr} (${filteredDrinks.length})`
          }
        </h3>

        <div className="drinks-grid">
          {isLoading ? (
            <div className="drinks-loading">
              <img src="/koneti-logo.png" alt="Loading" className="logo-bounce" />
            </div>
          ) : (
            paginatedDrinks.map(drink => (
              <div key={drink._id} className="drink-card">
                <div className="image-container">
                  <img src={drink.image} alt={drink.name} className="drink-img" />
                </div>
                <div className="card-content">
                  <h4>{drink.name}</h4>
                  <p>{drink.category?.name?.[language] || drink.category?.name?.sr}</p>
                  <span className="price">{drink.price} RSD</span>
                </div>
                <div className="drink-actions">
                  <button className="btn-edit" onClick={() => onEditDrink(drink)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn-delete" onClick={() => setShowDeleteConfirm(drink)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} style={{marginRight: '0.5rem'}} />
              {t('admin.menuManagement.pagination.prev')}
            </button>

            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={currentPage === page ? "active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              {t('admin.menuManagement.pagination.next')}
              <FontAwesomeIcon icon={faChevronRight} style={{marginLeft: '0.5rem'}} />
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-confirm-popup" onClick={(e) => e.stopPropagation()}>
            <h3>{t('admin.menuManagement.deleteConfirm.title')}</h3>
            <p>{t('admin.menuManagement.deleteConfirm.message')} <strong>{showDeleteConfirm.name}</strong>?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(null)}>
                {t('admin.menuManagement.deleteConfirm.cancel')}
              </button>
              <button className="btn-confirm" onClick={() => deleteDrink(showDeleteConfirm._id)}>
                {t('admin.menuManagement.deleteConfirm.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
