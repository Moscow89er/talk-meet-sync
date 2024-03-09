import React, { useEffect } from "react";
import { InfoTooltipProps } from "../../utils/types/commonTypes";
import onSucces from "../../images/on_succes.png";
import onError from "../../images/on_error.png";
import "./InfoTooltip.css";

const InfoTooltip: React.FC<InfoTooltipProps> = ({ isOpen, onClose, isError, tooltipConfirm, tooltipError }) => {
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
        <section className={`popup-tooltip ${isOpen ? "popup-tooltip_opened" : ""}`}>
            <div className="popup-tooltip__container">
                <img src={isError ? onError : onSucces} className="popup-tooltip__icon" alt="изображение лого" />
                <h2 className="popup-tooltip__title">{isError ? tooltipError : tooltipConfirm}</h2>
                <button type="button" className="popup-tooltip__close-button" onClick={onClose} />
            </div>
        </section>
    );
}

export default InfoTooltip;