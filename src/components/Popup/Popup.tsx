import React from 'react';
import { PopupProps } from '../../utils/types/commonTypes';
import "./Popup.css";

const Popup: React.FC<PopupProps> = ({ children, onClose }) => {
    return (
        <div className="modal show popup" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            aria-label="Закрыть"
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Popup;