package com.tcc.taskmanager.repository;

import com.tcc.taskmanager.model.Task;
import com.tcc.taskmanager.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByAssigneeId(Long assigneeId);
    
    List<Task> findByCreatorId(Long creatorId);
    
    List<Task> findByProjectId(Long projectId);
    
    List<Task> findByStatus(TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.assignee.id = :userId OR t.creator.id = :userId")
    List<Task> findTasksByUserId(@Param("userId") Long userId);
}