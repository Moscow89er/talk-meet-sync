import React, { useRef } from "react";
import useOutsideAlerter from "../../utils/hooks/useOutsideAlerter";
import { PopupProps } from "../../utils/types/commonTypes";
import "./ParentPopup.css";

const ParentPopup: React.FC<PopupProps> = ({ isOpen, title, children, onClose }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useOutsideAlerter(popupRef, isOpen, onClose);

    return (
        <section className="modal show popup" tabIndex={-1}>
            <div className="modal-dialog" ref={popupRef}>
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

export default ParentPopup;