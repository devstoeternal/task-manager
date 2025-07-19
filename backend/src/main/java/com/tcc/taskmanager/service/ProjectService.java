package com.tcc.taskmanager.service;

import com.tcc.taskmanager.model.Project;
import com.tcc.taskmanager.model.User;
import com.tcc.taskmanager.model.dto.ProjectDto;
import com.tcc.taskmanager.repository.ProjectRepository;
import com.tcc.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return convertToDto(project);
    }

    public List<ProjectDto> getProjectsByOwnerId(Long ownerId) {
        return projectRepository.findByOwnerId(ownerId).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public ProjectDto createProject(ProjectDto projectDto, String ownerUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
            .orElseThrow(() -> new RuntimeException("Owner not found"));

        Project project = new Project();
        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());
        project.setStatus(projectDto.getStatus());
        project.setOwner(owner);

        Project savedProject = projectRepository.save(project);
        return convertToDto(savedProject);
    }

    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());
        project.setStatus(projectDto.getStatus());

        Project updatedProject = projectRepository.save(project);
        return convertToDto(updatedProject);
    }

    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    private ProjectDto convertToDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        if (project.getOwner() != null) {
            dto.setOwnerId(project.getOwner().getId());
            dto.setOwnerName(project.getOwner().getFirstName() + " " + project.getOwner().getLastName());
        }

        return dto;
    }
}