import axios from 'axios';
import { API_URL } from './env';

export interface Event {
    id: string;
    title: string;
    date: string;
    minister: string;
    platform: string;
    time: string;
    imageUrl?: string;
    link?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EventsResponse {
    events: Event[];
    error?: string;
}

export const fetchEvents = async (params?: {
    activeOnly?: boolean;
    limit?: number;
    offset?: number;
}): Promise<Event[]> => {
    try {
        const searchParams = new URLSearchParams();
        
        if (params?.activeOnly !== undefined) {
            searchParams.append('active', params.activeOnly.toString());
        }
        if (params?.limit) {
            searchParams.append('limit', params.limit.toString());
        }
        if (params?.offset) {
            searchParams.append('offset', params.offset.toString());
        }

        const url = `${API_URL}/events${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
    }
};

export const createEvent = async (eventData: {
    title: string;
    date: string;
    minister: string;
    platform: string;
    time: string;
    imageUrl?: string;
    link?: string;
    isActive?: boolean;
}): Promise<Event> => {
    try {
        const response = await axios.post(`${API_URL}/events`, eventData);
        return response.data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Failed to create event');
    }
}; 