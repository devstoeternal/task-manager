export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}