import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import { API_URL } from '@/utils/env';

interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    product: {
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
    fetchCart: () => Promise<void>;
    handleRemoveItem: (itemId: number) => Promise<void>;
}

const UserCartContext = createContext<UserCartContextType | undefined>(undefined);

export const UserCartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<Cart>({ cartItems: [] });
    const { userId } = useUser();

    // ✅ useCallback ensures fetchCart is stable and doesn't trigger unnecessary re-renders
    const fetchCart = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await axios.post(`${API_URL}/cart`, { userId });
            const data = response.data;

            if (data && Array.isArray(data.cartItems)) {
                setCart(data);
            } else {
                // fallback for unexpected response
                setCart({ cartItems: [] });
            }

            console.log({ "loggedin userCart": data });
        } catch (error) {
            console.error("Error fetching user cart:", error);
            setCart({ cartItems: [] }); // set empty cart on error
        }
    }, [userId]);


    // ✅ Removes an item from the cart and updates state
    const handleRemoveItem = async (itemId: number) => {
        try {
            await axios.delete("/api/cart/remove", { data: { cartItemId: itemId } });
            setCart((prevCart) => ({
                ...prevCart,
                cartItems: prevCart.cartItems.filter((item) => item.id !== itemId),
            }));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // ✅ Fetch cart when userId changes
    useEffect(() => {
        if (userId) {
            fetchCart();
        }
    }, [userId, fetchCart]);

    return (
        <UserCartContext.Provider value={{ cart, fetchCart, handleRemoveItem }}>
            {children}
        </UserCartContext.Provider>
    );
};

// ✅ Custom hook to use the cart context safely
export const useUserCart = () => {
    const context = useContext(UserCartContext);
    if (!context) {
        throw new Error("useUserCart must be used within a UserCartProvider");
    }
    return context;
};