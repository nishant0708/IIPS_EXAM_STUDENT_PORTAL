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

const AlertModal = ({ isOpen, onClose, onConfirm, message, iserror, isConfirm }) => {
  var image = iserror ? cross : tick;

  const handleClose = () => {
    if (onConfirm) {
      onConfirm(); // Trigger the callback for  any action
    }
    onClose(); // Always close the modal
  };

  const handleConfirmClose=()=>
  {
      onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Success Modal"
      className="alert_modal"
      overlayClassName="alert_overlay"
    >
      <div className="alert_modal-content" onClick={(e)=>{e.stopPropagation();}}>
        {isConfirm ? (<svg className="alert_success-icon" fill="#ffe438" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" stroke="#ffe438"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M960 0c530.193 0 960 429.807 960 960s-429.807 960-960 960S0 1490.193 0 960 429.807 0 960 0Zm-9.838 1342.685c-84.47 0-153.19 68.721-153.19 153.19 0 84.47 68.72 153.192 153.19 153.192s153.19-68.721 153.19-153.191-68.72-153.19-153.19-153.19ZM1153.658 320H746.667l99.118 898.623h208.755L1153.658 320Z" fillRule="evenodd"></path></g></svg>) : (
            <img 
            src={image}
            alt="Success" 
            className="alert_success-icon"
          />
        )}

        <h2>{isConfirm ? "Warning" : iserror ? "Failed" : "Success"}</h2>
        <p>{message}</p>
        {isConfirm ? (
            <>
              <div className='alert_display-flex'>
                <div>
                  <button onClick={handleClose} className='alert_confirm-button'>
                    <div>Okay</div>
                    </button>
                </div>
                <button onClick={handleConfirmClose} className='alert_confirm-button'>
                  <div>Cancel</div>
                  </button>
              </div>
            </>
        ) : (<button onClick={handleClose} className="alert_close-button">
          Close
        </button>)}
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
  onConfirm: PropTypes.func, // onConfirm is optional and should be a function
  isConfirm: PropTypes.bool,
};

// Set default prop for optional onConfirm
AlertModal.defaultProps = {
  onConfirm: null,
  isConfirm: false,
};

export default AlertModal;
