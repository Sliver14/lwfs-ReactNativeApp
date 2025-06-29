import { API_URL } from '@/utils/env';
import axios from "axios";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as SecureStore from 'expo-secure-store';

interface UserDetails {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    zone: string;
    // profileImage?: string; // Added to match PersonalInfoScreen
}

interface UserContextType {
    userId: string | null;
    userDetails: UserDetails | null;
    setUserDetails: (details: UserDetails | null) => void;
    refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

    const fetchUserId = useCallback(async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                setUserId(null);
                setUserDetails(null);
                return;
            }

            const response = await axios.get(`${API_URL}/auth/tokenverify`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            setUserId(response.data.user.id);
            setUserDetails(response.data.user);
        } catch (error) {
            console.error("Error fetching user ID:", error);
            setUserId(null);
            setUserDetails(null);
        }
    }, []);

    useEffect(() => {
        fetchUserId();
    }, [fetchUserId]);

    return (
        <UserContext.Provider value={{ userId, userDetails, setUserDetails, refetchUser: fetchUserId }}>
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