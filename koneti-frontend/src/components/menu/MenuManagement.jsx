import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faSearch, faGlassMartiniAlt, faList, faChevronLeft, faChevronRight, faSort, faTag } from "@fortawesome/free-solid-svg-icons";
import "./MenuManagement.scss";

const API_URL = import.meta.env.VITE_API_URL;

export default function MenuManagement({ onAddDrink, onAddCategory, onEditDrink }) {
  const [categories, setCategories] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [categoriesRes, drinksRes] = await Promise.all([
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/drinks`)
      ]);
      
      const categoriesData = await categoriesRes.json();
      const drinksData = await drinksRes.json();
      
      setCategories(categoriesData);
      setDrinks(drinksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDrink = async (id) => {
    try {
      const response = await fetch(`${API_URL}/drinks/${id}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        setDrinks(drinks.filter(drink => drink._id !== id));
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
              placeholder="Pretraži pića..."
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
            Sve kategorije ({drinks.length})
          </button>
          {categories.map(category => (
            <button
              key={category._id}
              className={selectedCategory === category._id ? "active" : ""}
              onClick={() => setSelectedCategory(category._id)}
            >
              {category.name} ({drinks.filter(d => d.category?._id === category._id).length})
            </button>
          ))}
        </div>
        
        <div className="filter-container">
          <FontAwesomeIcon icon={faSort} className="filter-icon" />
          <label className="filter-label">Sortiraj po:</label>
          <select 
            className="filter-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">A-Z</option>
            <option value="price-low">Najjeftiniji</option>
            <option value="price-high">Najskuplji</option>
          </select>
        </div>
        
        <div className="action-buttons">
          <button className="btn-add-drink" onClick={onAddDrink}>
            <FontAwesomeIcon icon={faPlus} /> Dodaj piće
          </button>
          <button className="btn-add-category" onClick={onAddCategory}>
            <FontAwesomeIcon icon={faTag} /> Dodaj kategoriju
          </button>
        </div>
      </div>



      <div className="drinks-section">
        <h3>
          <FontAwesomeIcon icon={faGlassMartiniAlt} style={{marginRight: '0.5rem'}} />
          {selectedCategory === "all" 
            ? `Sva pića (${filteredDrinks.length})`
            : `${categories.find(c => c._id === selectedCategory)?.name || ""} (${filteredDrinks.length})`
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
                  <p>{drink.category?.name}</p>
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
              Prethodna
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
              Sledeća
              <FontAwesomeIcon icon={faChevronRight} style={{marginLeft: '0.5rem'}} />
            </button>
          </div>
        )}
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-confirm-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Potvrda brisanja</h3>
            <p>Da li ste sigurni da želite da obrišete piće <strong>{showDeleteConfirm.name}</strong>?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(null)}>
                Otkaži
              </button>
              <button className="btn-confirm" onClick={() => deleteDrink(showDeleteConfirm._id)}>
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}