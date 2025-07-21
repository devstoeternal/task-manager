package com.tcc.taskmanager.repository;

import com.tcc.taskmanager.model.Task;
import com.tcc.taskmanager.model.TaskStatus;
import com.tcc.taskmanager.model.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByUserId(Long userId);
    
    List<Task> findByUserIdAndStatus(Long userId, TaskStatus status);
    
    List<Task> findByUserIdAndPriority(Long userId, Priority priority);
    
    List<Task> findByUserIdAndTitleContainingIgnoreCase(Long userId, String title);
    
    Optional<Task> findByIdAndUserId(Long id, Long userId);
}