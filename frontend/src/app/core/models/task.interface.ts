import { User } from "./user.interface";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: User;
  creator: User;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  assigneeId?: number;
}

export interface UpdateTaskRequest extends CreateTaskRequest {
  status: TaskStatus;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  dueDateFrom?: string;
  dueDateTo?: string;
  assigneeId?: number;
  creatorId?: number;
  search?: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  highPriority: number;
  overdue: number;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  size: number;
}