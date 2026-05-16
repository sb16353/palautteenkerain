import {
    createContext,
    useContext,
    useState,
    useId,
    useEffect,
} from "react";

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
    const params = new URLSearchParams(document.location.search);
    const [errorMsg, setErrorMsg] = useState(params.get("error_msg"));
    const [visible, setVisible] = useState(true);
    const errorMsgId = useId();

    const FADE_AFTER_S = 10;
    const FADE_LENGTH_S = 2;

    const FADE_AFTER_MS = FADE_AFTER_S * 1000;
    const FADE_LENGTH_MS = FADE_LENGTH_S * 1000;

    const DISAPPEAR_TIME_MS = FADE_AFTER_MS + FADE_LENGTH_MS;

    useEffect(() => {
        if (!errorMsg) return;

        setVisible(true);

        // Fade out after DURATION_S seconds
        const fadeTimer = setTimeout(() => {
            setVisible(false);
        }, FADE_AFTER_MS);

        // Remove completely after fade animation
        const removeTimer = setTimeout(() => {
            setErrorMsg(null);
        }, DISAPPEAR_TIME_MS);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, [errorMsg]);

    const closePopup = () => {
        setVisible(false);

        setTimeout(() => {
            setErrorMsg(null);
        }, FADE_LENGTH_MS);
    };

    return (
        <ErrorContext.Provider value={{ errorMsg, setErrorMsg }}>
            {errorMsg && (
                <div
                    id={errorMsgId}
                    onClick={closePopup}
                    style={{
                        position: "fixed",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        padding: "16px 24px",
                        borderRadius: "12px",
                        zIndex: 9999,
                        cursor: "pointer",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                        opacity: visible ? 1 : 0,
                        transition: `opacity ${FADE_LENGTH_S}s ease`,
                        maxWidth: "80%",
                        textAlign: "center",
                        pointerEvents: visible ? "auto" : "none",
                    }}
                >
                    <h3 style={{ margin: 0 }}>{errorMsg}</h3>
                </div>
            )}

            {children}
        </ErrorContext.Provider>
    );
}

export function useError() {
    return useContext(ErrorContext);
}