import { useEffect } from "react";

function useOutsideAlerter(ref: React.RefObject<HTMLElement>, isOpen: boolean, onClose: () => void) {
    useEffect(() => {
        if (!isOpen) return;

        function handleOutsideClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        }

        function handleEscapeKey(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isOpen, onClose, ref]);
}

export default useOutsideAlerter;