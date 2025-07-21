export const environment = {
  production: true,
  apiUrl: 'https://api.taskmanager.com/api',
  appName: 'Sistema de Gestión de Tareas',
  version: '1.0.0',
  enableLogging: false,
  cacheTimeout: 600000, // 10 minutes
  tokenRefreshThreshold: 60000, // 1 minute
  storageKeys: {
    token: 'task_manager_token',
    user: 'task_manager_user',
    theme: 'task_manager_theme'
  }
};