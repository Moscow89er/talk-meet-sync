import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Header.css";
import { Header } from "../../utils/types/commonInterfaces";
import defaultImg from "../../images/default_img.jpg";

const Header: React.FC<Header> = ( { onSettingsClick } ) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleToggleMenuOpen = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsPopupOpen(!isPopupOpen);
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsPopupOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <header className="p-3 border-bottom">
            <div className="container d-flex flex-wrap align-items-center justify-content-between">
                
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-calendar-event" viewBox="0 0 16 16">
                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                </svg>

                <div onClick={handleToggleMenuOpen} className="dropdown" ref={dropdownRef}>
                    <button
                        className="reset-button-style d-block link-body-emphasis text-decoration-none dropdown-toggle" 
                        onClick={handleToggleMenuOpen}
                        aria-label="Toggle user menu"
                        aria-expanded={isPopupOpen}
                        aria-haspopup="true"
                    >
                        <img
                            src={defaultImg}
                            alt="My image"
                            width="32"
                            height="32"
                            className="rounded-circle user-image"
                        />
                    </button>
                    {isPopupOpen && 
                        <ul className="dropdown-menu dropdown-menu-end show" data-bs-popper="static">
                            <li><button className="dropdown-item" onClick={onSettingsClick}>Настройки</button></li>
                        </ul>
                    }
                </div>
            </div>
            
        </header>
    );
}

export default Header;