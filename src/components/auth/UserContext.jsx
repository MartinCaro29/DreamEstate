import React, { createContext, useState, useEffect } from "react";

// Create context
export const UserContext = createContext({});

// UserContextProvider Component
export const UserContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});

    // On component mount, check if the user is authenticated using the userId
    useEffect(() => {
        const userId = localStorage.getItem('userId');  // Retrieve the userId from localStorage
        if (userId) {
            // If a userId exists, set the userInfo (you can also fetch more details if needed)
            setUserInfo({ id: userId });
        }
    }, []);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};
