import { useCallback, useState } from "react";
import { PopupState } from "../types/apiTypes";

const usePopup = () => {
    const [popup, setPopup] = useState<PopupState>({
        activePopup: null,
        isPopupOpen: false,
    });

    const openPopup = useCallback((popupName: string) => {
        setPopup({
            activePopup: popupName,
            isPopupOpen: true,
        });
    }, []);

    const closePopup = useCallback(() => {
        setPopup(prevState => ({
            ...prevState,
            activePopup: null,
            isPopupOpen: false,
        }));
    }, []);

    return { popup, openPopup, closePopup };
};

export default usePopup;