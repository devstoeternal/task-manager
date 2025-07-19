package com.tcc.taskmanager.service;

import com.tcc.taskmanager.model.Task;
import com.tcc.taskmanager.model.User;
import com.tcc.taskmanager.model.Project;
import com.tcc.taskmanager.model.dto.TaskDto;
import com.tcc.taskmanager.repository.TaskRepository;
import com.tcc.taskmanager.repository.UserRepository;
import com.tcc.taskmanager.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        return convertToDto(task);
    }

    public List<TaskDto> getTasksByUserId(Long userId) {
        return taskRepository.findTasksByUserId(userId).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public TaskDto createTask(TaskDto taskDto, String creatorUsername) {
        User creator = userRepository.findByUsername(creatorUsername)
            .orElseThrow(() -> new RuntimeException("Creator not found"));

        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskDto.getStatus());
        task.setPriority(taskDto.getPriority());
        task.setDueDate(taskDto.getDueDate());
        task.setCreator(creator);

        if (taskDto.getAssigneeId() != null) {
            User assignee = userRepository.findById(taskDto.getAssigneeId())
                .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignee(assignee);
        }

        if (taskDto.getProjectId() != null) {
            Project project = projectRepository.findById(taskDto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
            task.setProject(project);
        }

        Task savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }

    public TaskDto updateTask(Long id, TaskDto taskDto) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskDto.getStatus());
        task.setPriority(taskDto.getPriority());
        task.setDueDate(taskDto.getDueDate());

        if (taskDto.getAssigneeId() != null) {
            User assignee = userRepository.findById(taskDto.getAssigneeId())
                .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignee(assignee);
        }

        if (taskDto.getProjectId() != null) {
            Project project = projectRepository.findById(taskDto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
            task.setProject(project);
        }

        Task updatedTask = taskRepository.save(task);
        return convertToDto(updatedTask);
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
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

        if (task.getAssignee() != null) {
            dto.setAssigneeId(task.getAssignee().getId());
            dto.setAssigneeName(task.getAssignee().getFirstName() + " " + task.getAssignee().getLastName());
        }

        if (task.getProject() != null) {
            dto.setProjectId(task.getProject().getId());
            dto.setProjectName(task.getProject().getName());
        }

        return dto;
    }
}