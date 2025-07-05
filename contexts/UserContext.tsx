import { API_URL } from '@/utils/env';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface UserDetails {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    zone: string;
    profileImage?: string; // Added to match PersonalInfoScreen
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

            // Log the API URL and token for debugging
            console.log('API URL:', API_URL);
            console.log('Token:', token);

            const response = await axios.get(`${API_URL}/auth/tokenverify`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Token verify response:', response.data);

            if (response.data.user) {
                setUserId(response.data.user.id);
                setUserDetails(response.data.user);
            } else {
                console.warn('No user data in response:', response.data);
                setUserId(null);
                setUserDetails(null);
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
            if (axios.isAxiosError(error)) {
                console.error("Response data:", error.response?.data);
                console.error("Response status:", error.response?.status);
            }
            setUserId(null);
            setUserDetails(null);
            // Optionally clear the token if it's invalid
            await SecureStore.deleteItemAsync('userToken');
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