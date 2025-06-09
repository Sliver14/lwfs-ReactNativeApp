// contexts/UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import { API_URL } from '@/utils/env';


interface UserDetails {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    zone: string;
    // Add other fields if necessary
}

interface UserContextType {
    userId: string | null;
    userDetails: UserDetails | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    console.log(API_URL)

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get(`${API_URL}/auth/tokenverify`, { withCredentials: true });
                setUserId(response.data.user.id);
                setUserDetails(response.data.user);
                // console.log({"loggedin userDetails": response.data.user});
                // console.log({"loggedin userId": response.data.user.id});
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };
        fetchUserId();
    }, []);

    return (
        <UserContext.Provider value={{ userId, userDetails }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};