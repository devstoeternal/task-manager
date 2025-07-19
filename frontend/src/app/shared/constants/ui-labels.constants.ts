export const UI_LABELS = {
  // Application
  APP_TITLE: 'Sistema de Gestión de Tareas',
  WELCOME: 'Bienvenido',
  
  // Authentication
  LOGIN: 'Iniciar Sesión',
  REGISTER: 'Registrarse',
  LOGOUT: 'Cerrar Sesión',
  EMAIL: 'Correo Electrónico',
  PASSWORD: 'Contraseña',
  FIRST_NAME: 'Nombre',
  LAST_NAME: 'Apellido',
  CONFIRM_PASSWORD: 'Confirmar Contraseña',
  FORGOT_PASSWORD: 'Olvidé mi contraseña',
  REMEMBER_ME: 'Recordarme',
  SIGN_IN_ALTERNATIVE: '¿Ya tienes cuenta? Inicia sesión',
  SIGN_UP_ALTERNATIVE: '¿No tienes cuenta? Regístrate',
  
  // Navigation
  DASHBOARD: 'Panel Principal',
  TASKS: 'Tareas',
  MY_TASKS: 'Mis Tareas',
  PROFILE: 'Perfil',
  SETTINGS: 'Configuración',
  
  // Tasks
  NEW_TASK: 'Nueva Tarea',
  EDIT_TASK: 'Editar Tarea',
  DELETE_TASK: 'Eliminar Tarea',
  TASK_DETAILS: 'Detalles de la Tarea',
  TASK_TITLE: 'Título de la tarea',
  TASK_DESCRIPTION: 'Descripción',
  DUE_DATE: 'Fecha límite',
  PRIORITY: 'Prioridad',
  STATUS: 'Estado',
  CREATED_AT: 'Creado el',
  UPDATED_AT: 'Actualizado el',
  
  // Task Status
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completada',
  
  // Task Priority
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  
  // Actions
  SAVE: 'Guardar',
  CANCEL: 'Cancelar',
  DELETE: 'Eliminar',
  EDIT: 'Editar',
  VIEW: 'Ver',
  ADD: 'Agregar',
  UPDATE: 'Actualizar',
  CREATE: 'Crear',
  CLOSE: 'Cerrar',
  CONFIRM: 'Confirmar',
  BACK: 'Volver',
  NEXT: 'Siguiente',
  PREVIOUS: 'Anterior',
  
  // Search and Filters
  SEARCH: 'Buscar',
  SEARCH_TASKS: 'Buscar tareas...',
  FILTER: 'Filtrar',
  FILTER_BY: 'Filtrar por',
  SORT_BY: 'Ordenar por',
  CLEAR_FILTERS: 'Limpiar filtros',
  ADVANCED_SEARCH: 'Búsqueda avanzada',
  
  // Dashboard
  STATISTICS: 'Estadísticas',
  RECENT_TASKS: 'Tareas Recientes',
  UPCOMING_TASKS: 'Próximas a Vencer',
  OVERDUE_TASKS: 'Tareas Vencidas',
  TOTAL_TASKS: 'Total de Tareas',
  COMPLETED_TASKS: 'Tareas Completadas',
  PENDING_TASKS: 'Tareas Pendientes',
  IN_PROGRESS_TASKS: 'Tareas en Progreso',
  HIGH_PRIORITY_TASKS: 'Tareas de Alta Prioridad',
  TASKS_THIS_WEEK: 'Tareas esta Semana',
  TASKS_THIS_MONTH: 'Tareas este Mes',
  COMPLETION_RATE: 'Tasa de Finalización',
  PRODUCTIVITY_TRENDS: 'Tendencias de Productividad',
  
  // Common
  DATE: 'Fecha',
  TIME: 'Hora',
  ACTIONS: 'Acciones',
  LOADING: 'Cargando...',
  NO_DATA: 'No hay datos disponibles',
  NO_TASKS_FOUND: 'No se encontraron tareas',
  NO_RESULTS: 'No se encontraron resultados',
  
  // Messages
  SUCCESS: 'Éxito',
  ERROR: 'Error',
  WARNING: 'Advertencia',
  INFO: 'Información',
  
  // Form validation messages
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Ingresa un email válido',
  MIN_LENGTH: 'Mínimo {0} caracteres',
  MAX_LENGTH: 'Máximo {0} caracteres',
  PASSWORDS_MUST_MATCH: 'Las contraseñas deben coincidir',
  INVALID_DATE: 'Fecha inválida',
  DATE_REQUIRED: 'La fecha es requerida',
  
  // Confirmation messages
  DELETE_TASK_CONFIRM: '¿Estás seguro de que deseas eliminar esta tarea?',
  DELETE_CONFIRM: 'Esta acción no se puede deshacer.',
  LOGOUT_CONFIRM: '¿Estás seguro de que deseas cerrar sesión?',
  
  // Success messages
  TASK_CREATED: 'Tarea creada exitosamente',
  TASK_UPDATED: 'Tarea actualizada exitosamente',
  TASK_DELETED: 'Tarea eliminada exitosamente',
  LOGIN_SUCCESS: 'Sesión iniciada exitosamente',
  REGISTER_SUCCESS: 'Registro exitoso',
  
  // Error messages
  LOGIN_ERROR: 'Error al iniciar sesión',
  REGISTER_ERROR: 'Error al registrar usuario',
  TASK_CREATE_ERROR: 'Error al crear tarea',
  TASK_UPDATE_ERROR: 'Error al actualizar tarea',
  TASK_DELETE_ERROR: 'Error al eliminar tarea',
  NETWORK_ERROR: 'Error de conexión',
  UNAUTHORIZED_ERROR: 'No autorizado',
  SERVER_ERROR: 'Error del servidor',
  
  // Responsive
  MENU: 'Menú',
  CLOSE_MENU: 'Cerrar menú',
  
  // Pagination
  ITEMS_PER_PAGE: 'Elementos por página',
  SHOWING_RESULTS: 'Mostrando {0} de {1} resultados',
  PAGE: 'Página',
  OF: 'de',
  
  // Time
  TODAY: 'Hoy',
  YESTERDAY: 'Ayer',
  TOMORROW: 'Mañana',
  THIS_WEEK: 'Esta semana',
  THIS_MONTH: 'Este mes',
  LAST_WEEK: 'Semana pasada',
  LAST_MONTH: 'Mes pasado',
  
  // Empty states
  NO_TASKS_TITLE: 'No tienes tareas',
  NO_TASKS_SUBTITLE: 'Comienza creando tu primera tarea',
  CREATE_FIRST_TASK: 'Crear primera tarea',
  
  // Tooltips
  ADD_NEW_TASK: 'Agregar nueva tarea',
  EDIT_TASK_TOOLTIP: 'Editar esta tarea',
  DELETE_TASK_TOOLTIP: 'Eliminar esta tarea',
  MARK_COMPLETE: 'Marcar como completada',
  MARK_PENDING: 'Marcar como pendiente',
  VIEW_DETAILS: 'Ver detalles',
} as const;

export type UILabel = typeof UI_LABELS[keyof typeof UI_LABELS];