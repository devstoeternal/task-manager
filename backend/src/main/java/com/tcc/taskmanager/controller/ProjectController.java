package com.tcc.taskmanager.controller;

import com.tcc.taskmanager.model.dto.ProjectDto;
import com.tcc.taskmanager.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        List<ProjectDto> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        ProjectDto project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody ProjectDto projectDto, 
                                                  Authentication authentication) {
        ProjectDto createdProject = projectService.createProject(projectDto, authentication.getName());
        return ResponseEntity.ok(createdProject);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, 
                                                  @Valid @RequestBody ProjectDto projectDto) {
        ProjectDto updatedProject = projectService.updateProject(id, projectDto);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok("Project deleted successfully!");
    }
}