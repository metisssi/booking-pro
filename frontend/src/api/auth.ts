import axiosInstance from './axios';
import { AuthResponse, RegisterDto, LoginDto, User } from '../types/index';



// ============================================
// REGISTER - new user registration
// ============================================

export const register = async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
    return response.data
};


// ============================================
// LOGIN - authorization
// ============================================


export const login = async (data: LoginDto): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auht/login', data)
    return response.data
};

// ============================================
// GET ME - get the current user
// ============================================

export const getMe = async (): Promise<{ user: User}> => {
  const response = await axiosInstance.get<{ user: User}>('/auth/me');
  return response.data;
};