package com.tcc.taskmanager.repository;

import com.tcc.taskmanager.model.Project;
import com.tcc.taskmanager.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByOwnerId(Long ownerId);
    
    List<Project> findByStatus(ProjectStatus status);
    
    List<Project> findByNameContainingIgnoreCase(String name);
}