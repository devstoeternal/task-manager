export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile extends User {
  fullName: string;
  initials: string;
}