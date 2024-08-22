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



const AlertModal = ({ isOpen, onClose, message,iserror }) => {
    var image = iserror?'https://www.svgrepo.com/show/401368/cross-mark.svg':"https://www.svgrepo.com/show/384403/accept-check-good-mark-ok-tick.svg" 
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Success Modal"
      className="alert_modal"
      overlayClassName="alert_overlay"
    >
      <div className="alert_modal-content">
        {/* SVG Image */}
        <img 
          src={image}
          alt="Success" 
          className="alert_success-icon"
        />
        <h2> 
            {iserror?"failed":"success"}
        </h2>
        <p>{message}</p> {/* Message passed as a prop */}
        <button onClick={onClose} className="alert_close-button">Close</button>
      </div>
    </Modal>
  );
};
// Define prop types
AlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,  // isOpen should be a boolean
  onClose: PropTypes.func.isRequired, // onClose should be a function
  message: PropTypes.string.isRequired, // message should be a string
  iserror: PropTypes.bool.isRequired
};


export default AlertModal;
