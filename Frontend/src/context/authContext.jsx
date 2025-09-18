/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";

export const authContext = createContext(null);
const baseUrl = "http://localhost:5000";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    // Load user from token on app load
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

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
            // console.log("show response", res);

            if (!res.ok) throw new Error("Signup failed");

            const data = await res.json();
            localStorage.setItem('token', data.token);
            console.log("try to find:", data.userData);

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
            if (!res.ok) throw new Error("Login failed");

            const data = await res.json();
            localStorage.setItem("token", data.token);

            if (data.isUser) {
                setUser(data.isUser)

            };

            return data.isUser
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const res = await fetch(`${baseUrl}/users/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user;
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
                formData.append("profilePicture", file); // must match multer field name
            }

            const res = await fetch(`${baseUrl}/users/api/updateProfile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // ❌ DO NOT set Content-Type manually (browser sets multipart/form-data)
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Profile update failed");
            const data = await res.json();
            console.log("Profile updated", data);
        } catch (error) {
            console.error(error);
        }
    };


    const getUsersForSidebar = async () => {
        const token = localStorage.getItem('token');
        if (!token) return [];
        const res = await fetch(`${baseUrl}/api/messages/users`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Get users failed");
        const data = await res.json();
        return data.users;
    };

    const getMessages = async (id) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/api/messages/${id}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Get messages failed");
        return await res.json();
    };

    const messageSend = async (formData, id) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/api/messages/${id}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData,
        });
        console.log(res);

        if (!res.ok) throw new Error("Send message failed");

        return await res.json();
    };


    const markMessageAsSeen = async (id) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/api/messages/mark/${id}`, {
            method: "PUT",
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Mark as seen failed");
        return await res.json();
    };

    return (
        <authContext.Provider value={{
            user,
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
