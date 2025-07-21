package com.tcc.taskmanager.service;

import com.tcc.taskmanager.model.Task;
import com.tcc.taskmanager.model.User;
import com.tcc.taskmanager.model.TaskStatus;
import com.tcc.taskmanager.model.Priority;
import com.tcc.taskmanager.model.dto.TaskDto;
import com.tcc.taskmanager.model.dto.TaskStatsDto;
import com.tcc.taskmanager.repository.TaskRepository;
import com.tcc.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TaskDto> getUserTasks(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return taskRepository.findByUserId(user.getId()).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public TaskDto getTaskById(Long id, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Task task = taskRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        return convertToDto(task);
    }

    public TaskDto createTask(TaskDto taskDto, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskDto.getStatus() != null ? taskDto.getStatus() : TaskStatus.TODO);
        task.setPriority(taskDto.getPriority() != null ? taskDto.getPriority() : Priority.MEDIUM);
        task.setDueDate(taskDto.getDueDate());
        task.setUser(user);

        Task savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }

    public TaskDto updateTask(Long id, TaskDto taskDto, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Task task = taskRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskDto.getStatus());
        task.setPriority(taskDto.getPriority());
        task.setDueDate(taskDto.getDueDate());

        Task updatedTask = taskRepository.save(task);
        return convertToDto(updatedTask);
    }

    public void deleteTask(Long id, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Task task = taskRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        taskRepository.delete(task);
    }

    public List<TaskDto> getUserTasksByStatus(String username, TaskStatus status) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return taskRepository.findByUserIdAndStatus(user.getId(), status).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public List<TaskDto> getUserTasksByPriority(String username, Priority priority) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return taskRepository.findByUserIdAndPriority(user.getId(), priority).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public List<TaskDto> searchUserTasks(String username, String query) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return taskRepository.findByUserIdAndTitleContainingIgnoreCase(user.getId(), query).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public TaskStatsDto getUserTaskStats(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Task> tasks = taskRepository.findByUserId(user.getId());
        
        long totalTasks = tasks.size();
        long todoTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
        long inProgressTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long doneTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();

        return new TaskStatsDto(totalTasks, todoTasks, inProgressTasks, doneTasks);
    }

    public TaskDto updateTaskStatus(Long id, TaskStatus status, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Task task = taskRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);
        return convertToDto(updatedTask);
    }

    private TaskDto convertToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        
        if (task.getUser() != null) {
            dto.setUserId(task.getUser().getId());
            dto.setUserFullName(task.getUser().getFullName());
        }
        
        return dto;
    }
}