import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import "./AlertModal.css"; 
import cross from "../assets/cross-mark.svg";
import tick from "../assets/accept-check-good-mark-ok-tick.svg";

const AlertModal = ({ isOpen, onClose, onConfirm, message, iserror, isConfirm }) => {
  const [modalMessage, setModalMessage] = useState(message);
  const [modalIsError, setModalIsError] = useState(iserror);
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const image = modalIsError ? cross : tick;

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.on("open-modal", (event, { message, isError }) => {
        setModalMessage(message);
        setModalIsError(isError);
        setModalIsOpen(true);
      });

      return () => {
        window.electron.ipcRenderer.removeAllListeners("open-modal");
      };
    }
  }, []);

  

  useEffect(() => {
    setModalIsOpen(isOpen);
    setModalMessage(message);
    setModalIsError(iserror);
  }, [isOpen, message, iserror]);

  const handleClose = () => {
    if (onConfirm) {
      onConfirm(); // Trigger the callback for any action
    }
    onClose(); // Always close the modal
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={onClose}
      contentLabel="Alert Modal"
      className="alert_modal"
      overlayClassName="alert_overlay"
    >
      <div className="alert_modal-content" onClick={(e) => e.stopPropagation()}>
        {isConfirm ? (
          <svg
            className="alert_success-icon"
            fill="#ffe438"
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffe438"
          >
            <path
              d="M960 0c530.193 0 960 429.807 960 960s-429.807 960-960 960S0 1490.193 0 960 429.807 0 960 0Zm-9.838 1342.685c-84.47 0-153.19 68.721-153.19 153.19 0 84.47 68.72 153.192 153.19 153.192s153.19-68.721 153.19-153.191-68.72-153.19-153.19-153.19ZM1153.658 320H746.667l99.118 898.623h208.755L1153.658 320Z"
              fillRule="evenodd"
            ></path>
          </svg>
        ) : (
          <img
            src={image}
            alt={modalIsError ? "Error" : "Success"}
            className="alert_success-icon"
          />
        )}

        <h2>{isConfirm ? "Warning" : modalIsError ? "Failed" : "Success"}</h2>
        <p>{modalMessage}</p>

        {isConfirm ? (
          <div className="alert_display-flex">
            <button onClick={handleClose} className="alert_confirm-button">
              Okay
            </button>
            <button onClick={onClose} className="alert_confirm-button">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={handleClose} className="alert_close-button">
            Close
          </button>
        )}
      </div>
    </Modal>
  );
};

AlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  iserror: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func,
  isConfirm: PropTypes.bool,
};

AlertModal.defaultProps = {
  onConfirm: null,
  isConfirm: false,
};

export default AlertModal;
