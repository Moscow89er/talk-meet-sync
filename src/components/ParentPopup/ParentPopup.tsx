import React, { useEffect } from "react";
import { PopupProps } from "../../utils/types/commonTypes";
import "./ParentPopup.css";

const Popup: React.FC<PopupProps> = ({ isOpen, title, children, onClose }) => {
    useEffect(() => {
        if (!isOpen) return;

        function handleESC(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }
        document.addEventListener("keydown", handleESC);

        return () => document.removeEventListener("keydown", handleESC)
    }, [isOpen, onClose]);

    return (
        <section className="modal show popup" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Popup;