export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  status?: TaskStatus;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  assigneeId?: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  todo: number;
  inProgress: number;
  inReview: number;
  cancelled: number;
  overdue: number;
  lowPriority: number;
  mediumPriority: number;
  highPriority: number;
  urgentPriority: number;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  size: number;
}