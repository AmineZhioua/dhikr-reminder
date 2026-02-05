import * as dhikrData from './dhikr-data.json';


export interface Dhikr {
    category: string;
    count: string;
    description: string;
    order: number;
    content: string;
};


export type Category = "Morning Dhikr" | "Evening Dhikr" | "After Salah" | "Before Sleep" | "Waking Up" | "Muhammad BPUH Duaa's" | "Quranic Duaa's";

export const dhikrCategories: Record<Category, Dhikr[]> = dhikrData;
