package com.tcc.taskmanager.repository;

import com.tcc.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Métodos existentes
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    
    // 🔍 MÉTODO PARA BUSCAR POR EMAIL (si no existe, agrégalo)
    Optional<User> findByEmail(String email);
    
    // 🔍 MÉTODO COMBO - Buscar por email O username en una sola query
    @Query("SELECT u FROM User u WHERE u.email = :emailOrUsername OR u.username = :emailOrUsername")
    Optional<User> findByEmailOrUsername(@Param("emailOrUsername") String emailOrUsername);
}