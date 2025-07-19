export interface Task {
  id?: number;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface TaskFilter {
  searchTerm?: string;
  status?: Status;
  priority?: Priority;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  highPriorityTasks: number;
  overdueTasks: number;
  tasksCompletedThisWeek: number;
  tasksCompletedThisMonth: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: Date;
}

export interface UpdateTaskRequest {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: Date;
}