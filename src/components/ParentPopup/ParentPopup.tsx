import React, { useEffect, useRef } from "react";
import { PopupProps } from "../../utils/types/commonTypes";
import "./ParentPopup.css";

const ParentPopup: React.FC<PopupProps> = ({ isOpen, title, children, onClose }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        function handleESC(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        function handleClickOutside(event: MouseEvent) {
            // Проверяем, что клик был вне контейнера попапа
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("keydown", handleESC);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleESC);
            document.removeEventListener("mousedown", handleClickOutside);
        }
        
    }, [isOpen, onClose]);

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