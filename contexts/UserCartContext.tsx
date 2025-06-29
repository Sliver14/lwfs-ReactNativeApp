// src/context/UserCartContext.tsx
// This context is for a React Native application

import axios, { AxiosError } from "axios";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store'; // For secure token storage in React Native

import { useUser } from "./UserContext"; // Make sure this path is correct
import { API_URL } from '@/utils/env'; // Ensure API_URL points to your Next.js backend (e.g., 'http://192.168.1.xxx:3000')

// Define a basic Product interface if you don't have one globally
interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    // Add any other relevant product properties here
}

interface CartItem {
    id: number; // This is the ID of the cart item entry itself in your DB
    productId: number; // This is the ID of the product
    quantity: number;
    product: {
        id: number; // Ensure product also has an ID
        name: string;
        price: number;
        imageUrl: string;
    };
}

interface Cart {
    cartItems: CartItem[];
}

interface UserCartContextType {
    cart: Cart;
    fetchUserCart: () => Promise<void>;
    addToCart: (product: Product) => Promise<void>; // <--- New: Add to Cart function
    increaseItemQuantity: (productId: number) => Promise<void>;
    decreaseItemQuantity: (productId: number) => Promise<void>;
    removeCartItemById: (cartItemId: number) => Promise<void>;
    clearUserCart: () => Promise<void>;
}

const UserCartContext = createContext<UserCartContextType | undefined>(undefined);

// Helper function to get token asynchronously from SecureStore
const getAuthToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync('userToken'); // Replace 'userToken' with your actual key
};

export const UserCartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<Cart>({ cartItems: [] });
    const { userId } = useUser(); // Get userId from UserContext

    // --- Core Cart Operations ---

    const fetchUserCart = useCallback(async () => {
        if (!userId) {
            setCart({ cartItems: [] });
            return;
        }

        const token = await getAuthToken();
        if (!token) {
            console.warn("Fetch Cart: No authentication token found. Cannot fetch user cart.");
            setCart({ cartItems: [] });
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = response.data; // This 'data' is the array of cart items

            // Check if 'data' is an array.
            // We'll then wrap this array in an object with 'cartItems' key
            // to match the structure expected by your 'setCart' state.
            if (Array.isArray(data)) {
                setCart({ cartItems: data }); // Set the cart state with the correct structure
                // console.log("User cart fetched:", { cartItems: data });
            } else {
                console.warn("Unexpected cart data structure on fetch: Expected an array, got", data);
                setCart({ cartItems: [] });
            }
        } catch (error: unknown) {
            console.error("Error fetching user cart:");
            setCart({ cartItems: [] });

            if (axios.isAxiosError(error)) {
                console.error("Axios error fetching cart:", error.response?.data || error.message);
            } else if (error instanceof Error) {
                console.error("General error fetching cart:", error.message);
            } else {
                console.error("Unknown error fetching cart:", error);
            }
        }
    }, [userId]);

    // <--- NEW: addToCart Function ---
    const addToCart = useCallback(async (product: Product) => {
        if (!userId) {
            console.warn("Add to Cart: No user ID found. User must be logged in.");
            return;
        }

        const token = await getAuthToken();
        if (!token) {
            console.warn("Add to Cart: No authentication token found. Cannot add item.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/cart`, {
                // Keep userId in the body if your backend explicitly expects it.
                // Otherwise, the backend should ideally derive userId solely from the token.
                userId,
                productId: product.id,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200 || response.status === 201) { // 200 OK or 201 Created
                await fetchUserCart(); // Refresh cart state after successful addition
                console.log('Product added to cart successfully:', product.name, response.data);
            }
        } catch (error: unknown) {
            console.error('Error adding product to cart:', error);
            if (axios.isAxiosError(error)) {
                console.error("Axios error adding to cart:", error.response?.data || error.message);
            } else if (error instanceof Error) {
                console.error("General error adding to cart:", error.message);
            } else {
                console.error("Unknown error adding to cart:", error);
            }
        }
    }, [userId, fetchUserCart]); // Add fetchUserCart to dependencies

    // --- Existing Cart Operations ---

    const increaseItemQuantity = useCallback(async (productId: number) => {
        const token = await getAuthToken();
        if (!token) {
            console.warn("Increase Quantity: No authentication token found.");
            return;
        }

        try {
            const response = await axios.patch(`${API_URL}/cart/increase`, { productId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setCart(response.data);
            await fetchUserCart();
            console.log("Increased quantity for product:", productId, response.data);
        } catch (error: unknown) {
            console.error("Error increasing item quantity for product:", productId);
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data || error.message);
            } else if (error instanceof Error) {
                console.error("General error:", error.message);
            } else {
                console.error("Unknown error:", error);
            }
        }
    }, [fetchUserCart]);

    const decreaseItemQuantity = useCallback(async (productId: number) => {
        const token = await getAuthToken();
        if (!token) {
            console.warn("Decrease Quantity: No authentication token found.");
            return;
        }

        try {
            const response = await axios.patch(`${API_URL}/cart/decrease`, { productId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setCart(response.data);
            await fetchUserCart();
            console.log("Decreased quantity for product:", productId, response.data);
        } catch (error: unknown) {
            console.error("Error decreasing item quantity for product:", productId);
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data || error.message);
            } else if (error instanceof Error) {
                console.error("General error:", error.message);
            } else {
                console.error("Unknown error:", error);
            }
        }
    }, [fetchUserCart]);

    const removeCartItemById = useCallback(async (cartItemId: number) => {
        const token = await getAuthToken();
        if (!token) {
            console.warn("Remove Item: No authentication token found.");
            return;
        }

        try {
            await axios.delete(`${API_URL}/cart/remove`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: { cartItemId: cartItemId }
            });
            setCart((prevCart) => ({
                ...prevCart,
                cartItems: prevCart.cartItems.filter((item) => item.id !== cartItemId),
            }));
            console.log("Removed cart item with ID:", cartItemId);
        } catch (error: unknown) {
            console.error("Error removing item with ID:", cartItemId);
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data || error.message);
            } else if (error instanceof Error) {
                console.error("General error:", error.message);
            } else {
                console.error("Unknown error:", error);
            }
        }
    }, []);

    const clearUserCart = useCallback(async () => {
        const token = await getAuthToken();
        if (!token) {
            console.warn("Clear Cart: No authentication token found.");
            return;
        }

        try {
            await axios.delete(`${API_URL}/cart/clear`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCart({ cartItems: [] });
            console.log("User cart cleared.");
        } catch (error: unknown) {
            console.error("Error clearing user cart:");
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data || error.message);
            } else if (error instanceof Error) {
                console.error("General error:", error.message);
            } else {
                console.error("Unknown error:", error);
            }
        }
    }, []);


    // --- Effect for Fetching Cart on UserID Change ---
    useEffect(() => {
        if (userId) {
            fetchUserCart();
        } else {
            setCart({ cartItems: [] });
        }
    }, [userId, fetchUserCart]);

    return (
        <UserCartContext.Provider value={{
            cart,
            fetchUserCart,
            addToCart, // <--- Add addToCart to the context value
            increaseItemQuantity,
            decreaseItemQuantity,
            removeCartItemById,
            clearUserCart
        }}>
            {children}
        </UserCartContext.Provider>
    );
};

// --- Custom Hook to Use the Cart Context ---
export const useUserCart = () => {
    const context = useContext(UserCartContext);
    if (!context) {
        throw new Error("useUserCart must be used within a UserCartProvider");
    }
    return context;
};