import React, { useState, useEffect, useRef } from 'react';

export default function Header() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleToggleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        
        setIsPopupOpen(!isPopupOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsPopupOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="p-3 border-bottom">
            <div className="container d-flex flex-wrap align-items-center justify-content-between">
                
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-calendar-event" viewBox="0 0 16 16">
                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                </svg>

                <div onClick={handleToggleMenuOpen} className="dropdown" ref={dropdownRef}>
                    <a 
                        href="#" 
                        className="d-block link-dark text-decoration-none dropdown-toggle" 
                        aria-expanded={isPopupOpen}
                    >
                        <img src="https://downloader.disk.yandex.ru/preview/ab0d5332aa600d28fa384ee98a4b84ea6b2cc2f4b3d4f12ea49a77c1603fc470/65dc54ce/6O60qL2_sCBhO1icjCb8y9uvl-7ulaEEsaNXf4YvoPIFw1rBHkyuZ30uxcSWoDNvwsR1JRf2VoMldFwMbeLUGg%3D%3D?uid=0&filename=about-me_photo.jpg&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=1921x964" alt="My image" width="32" height="32" className="rounded-circle" style={{ objectFit: 'cover', maxWidth: '100%' }} />
                    </a>
                    {isPopupOpen && 
                        <ul className="dropdown-menu dropdown-menu-end text-small" style={{ position: 'absolute' }}>
                            <li><a className="dropdown-item" href="#">Настройки</a></li>
                            <li><a className="dropdown-item" href="#">Профиль</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item" href="#">Выйти</a></li>
                        </ul>
                    }
                </div>
            </div>
            
        </header>
    );
}