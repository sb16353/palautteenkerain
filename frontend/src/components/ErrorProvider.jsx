import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
    const [errorMsg, setErrorMsg] = useState("");

    return (
        <ErrorContext.Provider value={{ errorMsg, setErrorMsg }}>
            {errorMsg && <h3>{errorMsg}</h3>}
            {children}
        </ErrorContext.Provider>
    );
}

export function useError() {
    return useContext(ErrorContext);
}