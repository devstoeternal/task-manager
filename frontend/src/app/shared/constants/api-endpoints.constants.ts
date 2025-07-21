import { environment } from '../../../environments/environment';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${environment.apiUrl}/auth/login`,
    REGISTER: `${environment.apiUrl}/auth/register`,
    REFRESH: `${environment.apiUrl}/auth/refresh`,
    CHANGE_PASSWORD: `${environment.apiUrl}/auth/change-password`
  },
  TASKS: {
    BASE: `${environment.apiUrl}/tasks`,
    MY_TASKS: `${environment.apiUrl}/tasks/my`,
    BY_ID: (id: number) => `${environment.apiUrl}/tasks/${id}`
  },
  USERS: {
    BASE: `${environment.apiUrl}/users`,
    PROFILE: `${environment.apiUrl}/users/profile`,
    BY_ID: (id: number) => `${environment.apiUrl}/users/${id}`
  }
};