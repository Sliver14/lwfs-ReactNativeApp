import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

type AuthContextType = {
    userToken: string | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (token) {
                    setUserToken(token);
                }
            } catch (error) {
                console.log('Error loading token:', error);
            } finally {
                setLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (token: string) => {
        await SecureStore.setItemAsync('userToken', token);
        setUserToken(token);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('userToken');
        setUserToken(null);
    };

    return (
        <AuthContext.Provider value={{ userToken, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
