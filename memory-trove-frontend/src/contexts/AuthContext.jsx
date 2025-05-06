import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [username, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if there's data in localStorage on mount
        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

        if (storedIsLoggedIn === "true") {
            setUserName(storedUsername);
            setPassword(storedPassword);
            setIsLoggedIn(true);
        }
    }, []);

    function login(userData) {
        setUserName(userData.username_email);
        setPassword(userData.password);
        setIsLoggedIn(true);

        // Store in localStorage
        localStorage.setItem("username", userData.username_email);
        localStorage.setItem("password", userData.password);
        localStorage.setItem("isLoggedIn", "true");
    }

    function logout() {
        setUserName(null);
        setPassword(null);
        setIsLoggedIn(false);

        // Remove from localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("isLoggedIn");
    }

    return (
        <AuthContext.Provider value={{ username, password, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}