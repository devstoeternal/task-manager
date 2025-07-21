package com.tcc.taskmanager.controller;

import com.tcc.taskmanager.model.dto.TaskDto;
import com.tcc.taskmanager.model.dto.TaskStatsDto;
import com.tcc.taskmanager.model.TaskStatus;
import com.tcc.taskmanager.model.Priority;
import com.tcc.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // ✅ CORREGIDO: Obtener SOLO las tareas del usuario autenticado
    @GetMapping
    public ResponseEntity<List<TaskDto>> getMyTasks(Authentication authentication) {
        List<TaskDto> tasks = taskService.getUserTasks(authentication.getName());
        return ResponseEntity.ok(tasks);
    }

    // ✅ CORREGIDO: Obtener UNA tarea específica (verificando propietario)
    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id, Authentication authentication) {
        TaskDto task = taskService.getTaskById(id, authentication.getName());
        return ResponseEntity.ok(task);
    }

    // ✅ CORREGIDO: Crear nueva tarea asignada al usuario autenticado
    @PostMapping
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody TaskDto taskDto, 
                                            Authentication authentication) {
        TaskDto createdTask = taskService.createTask(taskDto, authentication.getName());
        return ResponseEntity.ok(createdTask);
    }

    // ✅ CORREGIDO: Actualizar SOLO si es propietario de la tarea
    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, 
                                            @Valid @RequestBody TaskDto taskDto,
                                            Authentication authentication) {
        TaskDto updatedTask = taskService.updateTask(id, taskDto, authentication.getName());
        return ResponseEntity.ok(updatedTask);
    }

    // ✅ CORREGIDO: Eliminar SOLO si es propietario de la tarea
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, Authentication authentication) {
        taskService.deleteTask(id, authentication.getName());
        return ResponseEntity.ok("Tarea eliminada exitosamente");
    }

    // ✅ NUEVO: Filtrar MIS tareas por estado
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskDto>> getTasksByStatus(@PathVariable TaskStatus status, 
                                                        Authentication authentication) {
        List<TaskDto> tasks = taskService.getUserTasksByStatus(authentication.getName(), status);
        return ResponseEntity.ok(tasks);
    }

    // ✅ NUEVO: Filtrar MIS tareas por prioridad
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<TaskDto>> getTasksByPriority(@PathVariable Priority priority, 
                                                          Authentication authentication) {
        List<TaskDto> tasks = taskService.getUserTasksByPriority(authentication.getName(), priority);
        return ResponseEntity.ok(tasks);
    }

    // ✅ NUEVO: Buscar en MIS tareas
    @GetMapping("/search")
    public ResponseEntity<List<TaskDto>> searchTasks(@RequestParam String query, 
                                                   Authentication authentication) {
        List<TaskDto> tasks = taskService.searchUserTasks(authentication.getName(), query);
        return ResponseEntity.ok(tasks);
    }

    // ✅ NUEVO: Obtener estadísticas de MIS tareas
    @GetMapping("/stats")
    public ResponseEntity<TaskStatsDto> getMyTaskStats(Authentication authentication) {
        TaskStatsDto stats = taskService.getUserTaskStats(authentication.getName());
        return ResponseEntity.ok(stats);
    }

    // ✅ NUEVO: Cambiar estado de MI tarea
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskDto> updateTaskStatus(@PathVariable Long id, 
                                                   @RequestParam TaskStatus status,
                                                   Authentication authentication) {
        TaskDto updatedTask = taskService.updateTaskStatus(id, status, authentication.getName());
        return ResponseEntity.ok(updatedTask);
    }
}