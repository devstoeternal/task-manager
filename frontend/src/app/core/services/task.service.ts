import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { 
  Task, 
  TaskFilter, 
  TaskStats, 
  CreateTaskRequest, 
  UpdateTaskRequest,
  Priority,
  Status 
} from '../../shared/models/task.interface';
import { ApiResponse } from '../../shared/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = '/api/tasks';

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private statsSubject = new BehaviorSubject<TaskStats | null>(null);
  public stats$ = this.statsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Load all tasks for the current user
   */
  loadTasks(filters?: TaskFilter): Observable<Task[]> {
    this.loadingSubject.next(true);
    
    let params = new HttpParams();
    if (filters) {
      if (filters.searchTerm) {
        params = params.set('search', filters.searchTerm);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.priority) {
        params = params.set('priority', filters.priority);
      }
      if (filters.dueDateFrom) {
        params = params.set('dueDateFrom', filters.dueDateFrom.toISOString());
      }
      if (filters.dueDateTo) {
        params = params.set('dueDateTo', filters.dueDateTo.toISOString());
      }
    }

    return this.http.get<ApiResponse<Task[]>>(this.API_URL, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Convert date strings to Date objects
            const tasks = response.data.map(task => ({
              ...task,
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
              updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined
            }));
            this.tasksSubject.next(tasks);
            return tasks;
          }
          throw new Error(response.message || 'Failed to load tasks');
        }),
        tap(() => this.loadingSubject.next(false)),
        catchError(error => {
          console.error('Load tasks error:', error);
          this.loadingSubject.next(false);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get a specific task by ID
   */
  getTask(id: number): Observable<Task> {
    return this.http.get<ApiResponse<Task>>(`${this.API_URL}/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Convert date strings to Date objects
            const task = {
              ...response.data,
              dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined,
              createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
              updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined
            };
            return task;
          }
          throw new Error(response.message || 'Failed to load task');
        }),
        catchError(error => {
          console.error('Get task error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Create a new task
   */
  createTask(taskData: CreateTaskRequest): Observable<Task> {
    return this.http.post<ApiResponse<Task>>(this.API_URL, taskData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            const newTask = {
              ...response.data,
              dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined,
              createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
              updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined
            };

            // Update local tasks array
            const currentTasks = this.tasksSubject.value;
            this.tasksSubject.next([...currentTasks, newTask]);

            return newTask;
          }
          throw new Error(response.message || 'Failed to create task');
        }),
        catchError(error => {
          console.error('Create task error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Update an existing task
   */
  updateTask(taskData: UpdateTaskRequest): Observable<Task> {
    return this.http.put<ApiResponse<Task>>(`${this.API_URL}/${taskData.id}`, taskData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            const updatedTask = {
              ...response.data,
              dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined,
              createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
              updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined
            };

            // Update local tasks array
            const currentTasks = this.tasksSubject.value;
            const taskIndex = currentTasks.findIndex(task => task.id === updatedTask.id);
            if (taskIndex !== -1) {
              const updatedTasks = [...currentTasks];
              updatedTasks[taskIndex] = updatedTask;
              this.tasksSubject.next(updatedTasks);
            }

            return updatedTask;
          }
          throw new Error(response.message || 'Failed to update task');
        }),
        catchError(error => {
          console.error('Update task error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete a task
   */
  deleteTask(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`)
      .pipe(
        map(response => {
          if (response.success) {
            // Remove from local tasks array
            const currentTasks = this.tasksSubject.value;
            const filteredTasks = currentTasks.filter(task => task.id !== id);
            this.tasksSubject.next(filteredTasks);
          } else {
            throw new Error(response.message || 'Failed to delete task');
          }
        }),
        catchError(error => {
          console.error('Delete task error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get task statistics
   */
  getTaskStats(): Observable<TaskStats> {
    return this.http.get<ApiResponse<TaskStats>>(`${this.API_URL}/stats`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.statsSubject.next(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Failed to load task statistics');
        }),
        catchError(error => {
          console.error('Get task stats error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Update task status
   */
  updateTaskStatus(id: number, status: Status): Observable<Task> {
    return this.http.patch<ApiResponse<Task>>(`${this.API_URL}/${id}/status`, { status })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            const updatedTask = {
              ...response.data,
              dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined,
              createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
              updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined
            };

            // Update local tasks array
            const currentTasks = this.tasksSubject.value;
            const taskIndex = currentTasks.findIndex(task => task.id === updatedTask.id);
            if (taskIndex !== -1) {
              const updatedTasks = [...currentTasks];
              updatedTasks[taskIndex] = updatedTask;
              this.tasksSubject.next(updatedTasks);
            }

            return updatedTask;
          }
          throw new Error(response.message || 'Failed to update task status');
        }),
        catchError(error => {
          console.error('Update task status error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get upcoming tasks (due within the next 7 days)
   */
  getUpcomingTasks(): Observable<Task[]> {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const params = new HttpParams()
      .set('dueDateTo', nextWeek.toISOString())
      .set('status', Status.PENDING)
      .set('status', Status.IN_PROGRESS);

    return this.http.get<ApiResponse<Task[]>>(`${this.API_URL}`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(task => ({
              ...task,
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
              updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined
            }));
          }
          throw new Error(response.message || 'Failed to load upcoming tasks');
        }),
        catchError(error => {
          console.error('Get upcoming tasks error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get overdue tasks
   */
  getOverdueTasks(): Observable<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const params = new HttpParams()
      .set('dueDateTo', today.toISOString())
      .set('status', Status.PENDING)
      .set('status', Status.IN_PROGRESS);

    return this.http.get<ApiResponse<Task[]>>(`${this.API_URL}`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(task => ({
              ...task,
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
              updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined
            }));
          }
          throw new Error(response.message || 'Failed to load overdue tasks');
        }),
        catchError(error => {
          console.error('Get overdue tasks error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Clear local tasks cache
   */
  clearTasks(): void {
    this.tasksSubject.next([]);
    this.statsSubject.next(null);
  }

  /**
   * Get priority label in Spanish
   */
  getPriorityLabel(priority: Priority): string {
    switch (priority) {
      case Priority.LOW:
        return 'Baja';
      case Priority.MEDIUM:
        return 'Media';
      case Priority.HIGH:
        return 'Alta';
      default:
        return priority;
    }
  }

  /**
   * Get status label in Spanish
   */
  getStatusLabel(status: Status): string {
    switch (status) {
      case Status.PENDING:
        return 'Pendiente';
      case Status.IN_PROGRESS:
        return 'En Progreso';
      case Status.COMPLETED:
        return 'Completada';
      default:
        return status;
    }
  }
}