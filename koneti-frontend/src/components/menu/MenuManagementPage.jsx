import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import MenuManagement from "./MenuManagement";
import AddDrink from "../forms/AddDrink";
import AddCategory from "../forms/AddCategory";
import "./MenuManagementPage.scss";

Modal.setAppElement('#root');

export default function MenuManagementPage() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(null);
  const [editingDrink, setEditingDrink] = useState(null);

  return (
    <div className="menu-management-page">
      <main className="page-content">
        <MenuManagement 
          onAddDrink={() => setShowModal("addDrink")}
          onAddCategory={() => setShowModal("addCategory")}
          onEditDrink={(drink) => {
            setEditingDrink(drink);
            setShowModal("editDrink");
          }}
        />
      </main>

      {/* Modals */}
      <Modal
        isOpen={!!showModal}
        onRequestClose={() => setShowModal(null)}
        className={`ReactModal__Content ${showModal === 'editDrink' || showModal === 'addDrink' ? 'ReactModal__Content--tall-modal' : ''}`}
        overlayClassName="ReactModal__Overlay"
      >
        <div className="modal-header">
          <h3>
            {showModal === "addDrink" && t('admin.addDrink.title')}
            {showModal === "editDrink" && t('admin.addDrink.editTitle')}
            {showModal === "addCategory" && t('admin.addCategory.title')}
          </h3>
          <button onClick={() => setShowModal(null)}>{t('admin.closeButton')}</button>
        </div>
        <div className="modal-body">
          {(showModal === "addDrink" || showModal === "editDrink") && (
            <AddDrink 
              onClose={() => {
                setShowModal(null);
                setEditingDrink(null);
              }} 
              onSuccess={() => {
                setShowModal(null);
                setEditingDrink(null);
                window.location.reload();
              }}
              editData={editingDrink}
            />
          )}
          {showModal === "addCategory" && (
            <AddCategory 
              onClose={() => setShowModal(null)} 
              onSuccess={() => {
                setShowModal(null);
                window.location.reload();
              }} 
            />
          )}
        </div>
      </Modal>
    </div>
  );
}