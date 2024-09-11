// to use this modal you have to call function like this : 

// <AlertModal 
// isOpen={modalIsOpen} 
// onClose={() => setModalIsOpen(false)} 
// message="Your account has been created successfully." 
// iserror={true} if there is an error then iserror will be true else false
// />


import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import './AlertModal.css'; 
import cross from "../assets/cross-mark.svg";
import tick from "../assets/accept-check-good-mark-ok-tick.svg";

const AlertModal = ({ isOpen, onClose, onConfirm, message, iserror }) => {
  var image = iserror ? cross : tick;

  const handleClose = () => {
    if (onConfirm) {
      onConfirm(); // Trigger the callback for  any action
    }
    onClose(); // Always close the modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Success Modal"
      className="alert_modal"
      overlayClassName="alert_overlay"
    >
      <div className="alert_modal-content">
        <img 
          src={image}
          alt="Success" 
          className="alert_success-icon"
        />
        <h2>{iserror ? "Failed" : "Success"}</h2>
        <p>{message}</p>
        <button onClick={handleClose} className="alert_close-button">
          Close
        </button>
      </div>
    </Modal>
  );
};

// Define prop types
AlertModal.propTypes = {
  isAlert: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,  // isOpen should be a boolean
  onClose: PropTypes.func.isRequired, // onClose should be a function
  message: PropTypes.string.isRequired, // message should be a string
  iserror: PropTypes.bool.isRequired,  // iserror should be a boolean
  onConfirm: PropTypes.func // onConfirm is optional and should be a function
};

// Set default prop for optional onConfirm
AlertModal.defaultProps = {
  onConfirm: null
};

export default AlertModal;
