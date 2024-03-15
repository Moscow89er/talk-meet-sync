import React, { useRef } from "react";
import useOutsideAlerter from "../../utils/hooks/useOutsideAlerter";
import { InfoTooltipProps } from "../../utils/types/commonTypes";
import onSucces from "../../images/on_succes.png";
import onError from "../../images/on_error.png";
import "./InfoTooltip.css";

const InfoTooltip: React.FC<InfoTooltipProps> = ({ isOpen, onClose, isError, tooltipConfirm, tooltipError }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useOutsideAlerter(popupRef, isOpen, onClose);

    return (
        <section className={`popup-tooltip ${isOpen ? "popup-tooltip_opened" : ""}`}>
            <div className="popup-tooltip__container" ref={popupRef}>
                <img src={isError ? onError : onSucces} className="popup-tooltip__icon" alt="изображение лого" />
                <h2 className="popup-tooltip__title">{isError ? tooltipError : tooltipConfirm}</h2>
                <button type="button" className="popup-tooltip__close-button" onClick={onClose} />
            </div>
        </section>
    );
}

export default InfoTooltip;