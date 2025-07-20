// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'Sistema de Gestión de Tareas',
  version: '1.0.0',
  enableDebugMode: true,
  tokenConfig: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'current_user',
    tokenExpirationBuffer: 5 * 60 * 1000 // 5 minutes in milliseconds
  },
  ui: {
    language: 'es',
    theme: 'default',
    pageSize: 10,
    debounceTime: 300
  }
};

// src/environments/environment.prod.ts
/* export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  appName: 'Sistema de Gestión de Tareas',
  version: '1.0.0',
  enableDebugMode: false,
  tokenConfig: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'current_user',
    tokenExpirationBuffer: 5 * 60 * 1000
  },
  ui: {
    language: 'es',
    theme: 'default',
    pageSize: 20,
    debounceTime: 300
  }
}; */