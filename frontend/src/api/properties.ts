import axiosInstance from './axios';
import { Property, CreatePropertyDto } from '../types';


// ============================================
// GET ALL PROPERTIES (public access)
// ============================================


export const getAllProperties = async (filters?: {
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
}): Promise<Property[]> => {
    const params = new URLSearchParams();

    if (filters?.city) params.append('city', filters.city);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

    const response = await axiosInstance.get<Property[]>(`/properties?${params.toString()}`);
    return response.data
};

// ============================================
// GET PROPERTY BY ID (public access)
// ============================================

export const getPropertyById = async (id: string): Promise<Property> => {
    const response = await axiosInstance.get<Property>(`/properties/${id}`)
    return response.data
}


// ============================================
// GET MY PROPERTIES (only for HOST)
// ===========================================

export const createProperty = async (data: CreatePropertyDto): Promise<Property> => {
    const response = axiosInstance.post<Property>('/properties', data)
    return response.data;
}

// ============================================
// UPDATE PROPERTY (for the owner only)
// ============================================

export const updateProperty = async (
    id: string,
    data: Partial<CreatePropertyDto>
):  Promise<Property> => {
    const response = await axiosInstance.patch<Property>(`/properties/${id}`, data)
    return response.data
};

// ============================================
// DELETE PROPERTY (for the owner only)
// ============================================

export const deleteProperty = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/properties/${id}`)
}