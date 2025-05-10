import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [username, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");
        const storedUserId = localStorage.getItem("userId");
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

        if (storedIsLoggedIn === "true") {
            setUserName(storedUsername);
            setPassword(storedPassword);
            setUserId(storedUserId);
            setIsLoggedIn(true);
        }
        setLoading(false); // Done loading
    }, []);

    function login(userData) {
        setUserName(userData.username);
        setPassword(userData.contextPassword);
        setUserId(userData.userId); 
        setIsLoggedIn(true);

        // Store in localStorage
        localStorage.setItem("username", userData.username);
        localStorage.setItem("password", userData.contextPassword);
        localStorage.setItem("userId", userData.userId); 
        localStorage.setItem("isLoggedIn", "true");
    }

    function logout() {
        setUserName(null);
        setPassword(null);
        setUserId(null);
        setIsLoggedIn(false);

        // Remove from localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("userId");
        localStorage.removeItem("isLoggedIn");
    }

    return (
        <AuthContext.Provider value={{ 
            username, 
            password, 
            userId, 
            isLoggedIn, 
            login, 
            logout, 
            loading }}>
            {children}
        </AuthContext.Provider>
    );
}