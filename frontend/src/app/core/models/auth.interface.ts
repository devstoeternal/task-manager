export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
}

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  userId: number;
  username: string;
  email: string;
}