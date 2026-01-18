/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";

export const authContext = createContext(null);
const baseUrl = "https://chat-app-ypbg.onrender.com";
// const baseUrl = "http://localhost:5000"

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ADD THIS

    // Load user from token on app load
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false); // No token, done loading
            return;
        }

        (async () => {
            try {
                const res = await fetch(`${baseUrl}/users/api/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Not authenticated");
                const data = await res.json();
                setUser(data.user);
            } catch {
                setUser(null);
                localStorage.removeItem("token");
            } finally {
                setLoading(false); // Done loading
            }
        })();
    }, []);

    const signup = async (fullname, email, password) => {
        try {
            const res = await fetch(`${baseUrl}/users/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, password }),
            });

            if (!res.ok) throw new Error("Signup failed");

            const data = await res.json();
            localStorage.setItem('token', data.token);

            if (data.userData) setUser(data.userData);
            else {
                const me = await fetchCurrentUser();
                if (me) setUser(me);
            }
            return data.userData;
        } catch (error) {
            console.error(error);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await fetch(`${baseUrl}/users/api/login`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            console.log("what i get", res);
            
            if (!res.ok) throw new Error("Login failed");

            const data = await res.json();
            localStorage.setItem("token", data.token);

            if (data.isUser) {
                setUser(data.isUser);
            }

            return data.isUser;
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) return null;

        try {
            const res = await fetch(`${baseUrl}/users/api/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return null;
            const data = await res.json();

            return data.user;
        } catch (error) {
            console.log(error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const updateUserProfile = async (name, bio, file) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("fullname", name);
            formData.append("bio", bio);
            if (file) {
                formData.append("profilePicture", file);
            }

            const res = await fetch(`${baseUrl}/users/api/updateProfile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Profile update failed");
            const data = await res.json();

            // Update user state immediately
            if (data.user) {
                setUser(data.user);
            }

            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const getUsersForSidebar = async () => {
        const token = localStorage.getItem('token');
        if (!token) return [];
        try {
            const res = await fetch(`${baseUrl}/api/messages/users`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Get users failed");
            const data = await res.json();

            return data.users;
        } catch (error) {
            console.log(error);
        }
    };

    const getMessages = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${baseUrl}/api/messages/${id}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Get messages failed");
            let data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const messageSend = async (formData, id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${baseUrl}/api/messages/${id}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error("Send message failed");

            return await res.json();
        } catch (error) {
            console.log(error);
        }
    };

    const markMessageAsSeen = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${baseUrl}/api/messages/mark/${id}`, {
                method: "PUT",
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Mark as seen failed");
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <authContext.Provider value={{
            user,
            loading, // ADD THIS
            signup,
            login,
            logout,
            updateUserProfile,
            getUsersForSidebar,
            getMessages,
            messageSend,
            markMessageAsSeen,
            fetchCurrentUser,
        }}>
            {children}
        </authContext.Provider>
    );
};