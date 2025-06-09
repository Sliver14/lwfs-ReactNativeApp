// app/_layout.tsx
import { Slot } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { UserProvider } from "@/contexts/UserContext";
import "./globals.css";
import {UserCartProvider} from "@/contexts/UserCartContext";

export default function RootLayout() {
    return (
        <AuthProvider>
            <UserProvider>
                <UserCartProvider>
                    <Slot />
                </UserCartProvider>
            </UserProvider>
        </AuthProvider>
    )
}