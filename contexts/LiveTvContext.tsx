// src/contexts/LiveTvContext.tsx
import axios, { AxiosError } from "axios";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store'; // For secure token storage in React Native

import { useUser } from './UserContext'; // Assuming you have a UserContext
import { API_URL } from '@/utils/env'; // Your API base URL

// --- Interfaces for API Data ---

interface Program {
    id: number;
    title: string;
    description: string;
    videoUrl: string; // Assuming the live stream URL is part of the program data
    isLive: boolean;
    startTime: string; // ISO string
    // Assuming viewerCount is part of the program response, or we'll manage it locally
    viewerCount?: number;
}

interface Comment {
    id: number;
    content: string;
    userId: string;
    programId: number;
    createdAt: string; // ISO string
    user: {
        firstName: string;
        lastName: string;
    };
}

// --- Context Type Definition ---

interface LiveTvContextType {
    currentProgram: Program | null;
    comments: Comment[];
    loadingProgram: boolean;
    loadingComments: boolean;
    error: string | null;
    fetchLiveProgram: () => Promise<void>;
    fetchLiveComments: () => Promise<void>;
    postComment: (content: string) => Promise<void>;
    recordParticipation: () => Promise<void>;
}

const LiveTvContext = createContext<LiveTvContextType | undefined>(undefined);

// --- Helper to get Auth Token ---
const getAuthToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync('userToken'); // Replace 'userToken' with your actual key
};

// --- LiveTvProvider Component ---
export const LiveTvProvider = ({ children }: { children: ReactNode }) => {
    const { userId } = useUser(); // Get userId from UserContext
    const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingProgram, setLoadingProgram] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false); // Comments might load after program
    const [error, setError] = useState<string | null>(null);

    // --- API Call Functions ---

    const fetchLiveProgram = useCallback(async () => {
        setLoadingProgram(true);
        setError(null);
        const token = await getAuthToken();
        if (!token) {
            setError("Unauthorized: No authentication token found.");
            setLoadingProgram(false);
            setCurrentProgram(null);
            return;
        }

        try {
            const response = await axios.get<Program>(`${API_URL}/livetv`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCurrentProgram(response.data);
            console.log("Fetched live program:", response.data);
            // After fetching program, also fetch its comments
            fetchLiveComments();
        } catch (err: unknown) {
            console.error("Error fetching live program:");
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.error || err.message;
                setError(`Failed to fetch program: ${message}`);
                console.error("Axios error:", err.response?.data || err.message);
            } else if (err instanceof Error) {
                setError(`Failed to fetch program: ${err.message}`);
                console.error("General error:", err.message);
            } else {
                setError("An unknown error occurred while fetching program.");
                console.error("Unknown error:", err);
            }
            setCurrentProgram(null); // Clear program on error
        } finally {
            setLoadingProgram(false);
        }
    }, []); // No dependencies as it fetches generic live program

    const fetchLiveComments = useCallback(async () => {
        if (!currentProgram?.id) { // Only fetch comments if there's a live program ID
            setComments([]); // Clear comments if no program
            return;
        }

        setLoadingComments(true);
        setError(null); // Clear previous errors
        const token = await getAuthToken();
        if (!token) {
            setError("Unauthorized: No authentication token found for comments.");
            setLoadingComments(false);
            setComments([]);
            return;
        }

        try {
            // Note: Your comments API assumes the backend gets the programId for comments.
            // If it needed `programId` in the query, it would be:
            // const response = await axios.get<Comment[]>(`${API_URL}/livetv/comments?programId=${currentProgram.id}`, {
            const response = await axios.get<Comment[]>(`${API_URL}/livetv/comments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setComments(response.data);
            console.log("Fetched comments:", response.data);
        } catch (err: unknown) {
            console.error("Error fetching comments:");
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.error || err.message;
                setError(`Failed to fetch comments: ${message}`);
                console.error("Axios error:", err.response?.data || err.message);
            } else if (err instanceof Error) {
                setError(`Failed to fetch comments: ${err.message}`);
                console.error("General error:", err.message);
            } else {
                setError("An unknown error occurred while fetching comments.");
                console.error("Unknown error:", err);
            }
            setComments([]); // Clear comments on error
        } finally {
            setLoadingComments(false);
        }
    }, [currentProgram?.id]); // Re-run if currentProgram ID changes

    const postComment = useCallback(async (content: string) => {
        if (!userId) {
            setError("User not logged in. Cannot post comment.");
            return;
        }
        if (!currentProgram?.id) {
            setError("No live program to comment on.");
            return;
        }

        setError(null);
        const token = await getAuthToken();
        if (!token) {
            setError("Unauthorized: No authentication token found for posting comment.");
            return;
        }

        try {
            await axios.post(`${API_URL}/livetv/comments`, { content }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("Comment posted successfully.");
            // Re-fetch comments to update the UI with the new comment
            fetchLiveComments();
        } catch (err: unknown) {
            console.error("Error posting comment:");
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.error || err.message;
                setError(`Failed to post comment: ${message}`);
                console.error("Axios error:", err.response?.data || err.message);
            } else if (err instanceof Error) {
                setError(`Failed to post comment: ${err.message}`);
                console.error("General error:", err.message);
            } else {
                setError("An unknown error occurred while posting comment.");
                console.error("Unknown error:", err);
            }
        }
    }, [userId, currentProgram?.id, fetchLiveComments]);

    const recordParticipation = useCallback(async () => {
        if (!userId) {
            setError("User not logged in. Cannot record participation.");
            return;
        }
        if (!currentProgram?.id) {
            setError("No live program to record participation for.");
            return;
        }

        setError(null);
        const token = await getAuthToken();
        if (!token) {
            setError("Unauthorized: No authentication token found for participation.");
            return;
        }

        try {
            await axios.post(`${API_URL}/livetv/participate`, {}, { // No body needed based on your API
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("Participation recorded successfully.");
            // Optionally, you might re-fetch program to update viewer count if API updates it
            // fetchLiveProgram();
        } catch (err: unknown) {
            console.error("Error recording participation:");
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.error || err.message;
                setError(`Failed to record participation: ${message}`);
                console.error("Axios error:", err.response?.data || err.message);
            } else if (err instanceof Error) {
                setError(`Failed to record participation: ${err.message}`);
                console.error("General error:", err.message);
            } else {
                setError("An unknown error occurred while recording participation.");
                console.error("Unknown error:", err);
            }
        }
    }, [userId, currentProgram?.id, fetchLiveProgram]); // fetchLiveProgram added for potential re-fetch

    // --- Initial Data Load & Effects ---

    useEffect(() => {
        // Fetch live program when userId becomes available or changes
        if (userId) {
            fetchLiveProgram();
        } else {
            // Clear state if user logs out
            setCurrentProgram(null);
            setComments([]);
            setLoadingProgram(false);
            setLoadingComments(false);
            setError(null);
        }
    }, [userId, fetchLiveProgram]); // Dependency on fetchLiveProgram for initial load

    // Use a separate effect to fetch comments if program loads later
    useEffect(() => {
        if (currentProgram?.id) {
            fetchLiveComments();
        }
    }, [currentProgram?.id, fetchLiveComments]);


    return (
        <LiveTvContext.Provider value={{
            currentProgram,
            comments,
            loadingProgram,
            loadingComments,
            error,
            fetchLiveProgram,
            fetchLiveComments,
            postComment,
            recordParticipation
        }}>
            {children}
        </LiveTvContext.Provider>
    );
};

// --- Custom Hook to use the LiveTvContext ---
export const useLiveTv = () => {
    const context = useContext(LiveTvContext);
    if (!context) {
        throw new Error("useLiveTv must be used within a LiveTvProvider");
    }
    return context;
};
