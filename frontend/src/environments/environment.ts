export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'Sistema de Gestión de Tareas',
  version: '1.0.0',
  enableLogging: true,
  cacheTimeout: 300000, // 5 minutes
  tokenRefreshThreshold: 60000, // 1 minute
  storageKeys: {
    token: 'task_manager_token',
    user: 'task_manager_user',
    theme: 'task_manager_theme'
  }
};