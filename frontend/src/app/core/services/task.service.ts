import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilter, 
  TaskStats,
  TasksResponse,
  TaskStatus,
  TaskPriority 
} from '../models/task.interface';
import { PaginationParams } from '../models/api.interface';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constants';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private statsSubject = new BehaviorSubject<TaskStats | null>(null);

  public tasks$ = this.tasksSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllTasks(pagination?: PaginationParams, filter?: TaskFilter): Observable<TasksResponse> {
    this.loadingSubject.next(true);
    
    let params = new HttpParams();
    
    if (pagination) {
      params = params.set('page', pagination.page.toString());
      params = params.set('size', pagination.size.toString());
      if (pagination.sort) {
        params = params.set('sort', pagination.sort);
        params = params.set('direction', pagination.direction || 'asc');
      }
    }

    if (filter) {
      if (filter.status?.length) {
        filter.status.forEach(status => {
          params = params.append('status', status);
        });
      }
      if (filter.priority?.length) {
        filter.priority.forEach(priority => {
          params = params.append('priority', priority);
        });
      }
      if (filter.search) {
        params = params.set('search', filter.search);
      }
      if (filter.dueDateFrom) {
        params = params.set('dueDateFrom', filter.dueDateFrom);
      }
      if (filter.dueDateTo) {
        params = params.set('dueDateTo', filter.dueDateTo);
      }
      if (filter.assigneeId) {
        params = params.set('assigneeId', filter.assigneeId.toString());
      }
    }

    return this.http.get<Task[]>(API_ENDPOINTS.TASKS.BASE, { params })
      .pipe(
        map(tasks => ({
          tasks,
          total: tasks.length,
          page: pagination?.page || 0,
          size: pagination?.size || tasks.length
        })),
        tap(response => {
          this.tasksSubject.next(response.tasks);
          this.updateStats(response.tasks);
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          throw error;
        })
      );
  }

  getMyTasks(pagination?: PaginationParams, filter?: TaskFilter): Observable<TasksResponse> {
    this.loadingSubject.next(true);
    
    let params = new HttpParams();
    
    if (pagination) {
      params = params.set('page', pagination.page.toString());
      params = params.set('size', pagination.size.toString());
    }

    return this.http.get<Task[]>(API_ENDPOINTS.TASKS.MY_TASKS, { params })
      .pipe(
        map(tasks => {
          let filteredTasks = tasks;
          
          if (filter) {
            if (filter.status?.length) {
              filteredTasks = filteredTasks.filter(task => 
                filter.status!.includes(task.status)
              );
            }
            if (filter.priority?.length) {
              filteredTasks = filteredTasks.filter(task => 
                filter.priority!.includes(task.priority)
              );
            }
            if (filter.search) {
              const searchLower = filter.search.toLowerCase();
              filteredTasks = filteredTasks.filter(task => 
                task.title.toLowerCase().includes(searchLower) ||
                task.description.toLowerCase().includes(searchLower)
              );
            }
          }

          return {
            tasks: filteredTasks,
            total: filteredTasks.length,
            page: pagination?.page || 0,
            size: pagination?.size || filteredTasks.length
          };
        }),
        tap(response => {
          this.tasksSubject.next(response.tasks);
          this.updateStats(response.tasks);
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          throw error;
        })
      );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(API_ENDPOINTS.TASKS.BY_ID(id));
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(API_ENDPOINTS.TASKS.BASE, task)
      .pipe(
        tap(newTask => {
          const currentTasks = this.tasksSubject.value;
          this.tasksSubject.next([newTask, ...currentTasks]);
          this.updateStats([newTask, ...currentTasks]);
        })
      );
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(API_ENDPOINTS.TASKS.BY_ID(id), task)
      .pipe(
        tap(updatedTask => {
          const currentTasks = this.tasksSubject.value;
          const index = currentTasks.findIndex(t => t.id === id);
          if (index !== -1) {
            currentTasks[index] = updatedTask;
            this.tasksSubject.next([...currentTasks]);
            this.updateStats(currentTasks);
          }
        })
      );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.TASKS.BY_ID(id))
      .pipe(
        tap(() => {
          const currentTasks = this.tasksSubject.value;
          const filteredTasks = currentTasks.filter(task => task.id !== id);
          this.tasksSubject.next(filteredTasks);
          this.updateStats(filteredTasks);
        })
      );
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    const currentTasks = this.tasksSubject.value;
    const task = currentTasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    const updateData: UpdateTaskRequest = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      status: status,
      assigneeId: task.assignee?.id
    };

    return this.updateTask(id, updateData);
  }

  getTaskStats(): Observable<TaskStats> {
    return this.stats$.pipe(
      map(stats => stats || this.calculateStats(this.tasksSubject.value))
    );
  }

  private updateStats(tasks: Task[]): void {
    const stats = this.calculateStats(tasks);
    this.statsSubject.next(stats);
  }

  private calculateStats(tasks: Task[]): TaskStats {
    const now = new Date();
    
    return {
      total: tasks.length,
      todo: tasks.filter(task => task.status === 'TODO').length,
      inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
      done: tasks.filter(task => task.status === 'DONE').length,
      highPriority: tasks.filter(task => task.priority === 'HIGH').length,
      overdue: tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate < now && task.status !== 'DONE';
      }).length
    };
  }

  refreshTasks(): void {
    this.getAllTasks().subscribe();
  }
}