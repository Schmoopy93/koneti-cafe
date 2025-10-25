import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import MenuManagement from "./MenuManagement";
import AddDrink from "../forms/AddDrink";
import AddCategory from "../forms/AddCategory";
import "./MenuManagementPage.scss";

const API_URL = import.meta.env.VITE_API_URL;
Modal.setAppElement('#root');

export default function MenuManagementPage() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(null);
  const [editingDrink, setEditingDrink] = useState(null);
  const [drinks, setDrinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="menu-management-page">
      <main className="page-content">
        <MenuManagement
          drinks={drinks}
          categories={categories}
          setDrinks={setDrinks}
          setCategories={setCategories}
          onAddDrink={() => setShowModal("addDrink")}
          onAddCategory={() => setShowModal("addCategory")}
          onEditDrink={(drink) => {
            setEditingDrink(drink);
            setShowModal("editDrink");
          }}
          onDeleteDrink={async (id) => {
            try {
              const res = await fetch(`${API_URL}/drinks/${id}`, { method: 'DELETE' });
              if (!res.ok) throw new Error('Delete failed');
              await fetchData();
            } catch (e) {
              console.error('Error deleting drink:', e);
              throw e;
            }
          }}
          isLoading={isLoading}
        />
      </main>

      {/* Modals */}
      <Modal
        isOpen={!!showModal}
        onRequestClose={() => {
          setShowModal(null);
          setEditingDrink(null);
        }}
        className={`ReactModal__Content ${showModal === 'editDrink' || showModal === 'addDrink' ? 'ReactModal__Content--tall-modal' : ''}`}
        overlayClassName="ReactModal__Overlay"
      >
        <div className="modal-header">
          <h3>
            {showModal === "addDrink" && t('admin.addDrink.title')}
            {showModal === "editDrink" && t('admin.addDrink.editTitle')}
            {showModal === "addCategory" && t('admin.addCategory.title')}
          </h3>
          <button onClick={() => {
            setShowModal(null);
            setEditingDrink(null);
          }}>{t('admin.closeButton')}</button>
        </div>

        <div className="modal-body">
          {(showModal === "addDrink" || showModal === "editDrink") && (
            <AddDrink
              editData={editingDrink}
              onClose={() => {
                setShowModal(null);
                setEditingDrink(null);
              }}
              onSuccess={async () => {
                // Always refetch to ensure consistent shape and relations
                await fetchData();
                setShowModal(null);
                setEditingDrink(null);
              }}
            />
          )}

          {showModal === "addCategory" && (
            <AddCategory
              onClose={() => setShowModal(null)}
              onSuccess={async () => {
                // Refetch categories and drinks to keep counts and filters accurate
                await fetchData();
                setShowModal(null);
              }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
