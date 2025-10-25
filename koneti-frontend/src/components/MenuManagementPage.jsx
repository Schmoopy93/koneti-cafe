import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import MenuManagement from "./MenuManagement";
import AddDrink from "./AddDrink";
import AddCategory from "./AddCategory";
import "./MenuManagementPage.scss";

Modal.setAppElement('#root');

export default function MenuManagementPage() {
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
            {showModal === "addDrink" && "Dodaj novo piće"}
            {showModal === "editDrink" && "Uredi piće"}
            {showModal === "addCategory" && "Dodaj novu kategoriju"}
          </h3>
          <button onClick={() => setShowModal(null)}>×</button>
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