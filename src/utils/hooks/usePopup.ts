import { useCallback, useState } from 'react';
import { PopupState } from '../types/apiTypes';

const usePopup = () => {
    const [popupState, setPopupState] = useState<PopupState>({
        activePopup: null,
        isPopupOpen: false,
    });

    const openPopup = useCallback((popupName: string) => {
        setPopupState({
            activePopup: popupName,
            isPopupOpen: true,
        });
    }, []);

    const closePopup = useCallback(() => {
        setPopupState(prevState => ({
            ...prevState,
            activePopup: null,
            isPopupOpen: false,
        }));
    }, []);

    return { popupState, openPopup, closePopup };
};

export default usePopup;