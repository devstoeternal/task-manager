# Enterprise Task Management System - Backend Setup Guide

This guide provides complete instructions for setting up the Spring Boot backend that works with the Angular frontend.

## 🏗️ Backend Architecture

### Technology Stack
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + JWT
- **Database**: SQL Server with JPA/Hibernate
- **API Documentation**: SpringDoc OpenAPI 3
- **Build Tool**: Maven
- **Java Version**: 17+

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/tcc/taskmanager/
│   │   │   ├── TaskManagerApplication.java     # Main Spring Boot class
│   │   │   ├── controller/                     # REST Controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   └── TaskController.java
│   │   │   ├── service/                        # Business Logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── TaskService.java
│   │   │   │   └── UserService.java
│   │   │   ├── repository/                     # JPA Repositories
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── TaskRepository.java
│   │   │   ├── model/                          # Entities & DTOs
│   │   │   │   ├── entity/
│   │   │   │   │   ├── User.java
│   │   │   │   │   └── Task.java
│   │   │   │   └── dto/
│   │   │   │       ├── LoginRequest.java
│   │   │   │       ├── AuthResponse.java
│   │   │   │       └── TaskDto.java
│   │   │   ├── config/                         # Configuration
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── JwtConfig.java
│   │   │   │   └── CorsConfig.java
│   │   │   └── exception/                      # Exception Handling
│   │   │       ├── GlobalExceptionHandler.java
│   │   │       └── CustomExceptions.java
│   │   └── resources/
│   │       ├── application.yml                 # Main configuration
│   │       ├── application-dev.yml             # Development config
│   │       └── data.sql                        # Sample data (optional)
│   └── test/                                   # Unit tests
├── pom.xml                                     # Maven dependencies
└── README.md                                   # Backend documentation
```

## 🚀 Quick Setup

### 1. Create Spring Boot Project

Using Spring Initializr (https://start.spring.io/):

**Project Configuration:**
- Project: Maven
- Language: Java
- Spring Boot: 3.2.x
- Group: com.tcc
- Artifact: task-manager
- Name: Task Manager
- Package name: com.tcc.taskmanager
- Packaging: Jar
- Java: 17

**Dependencies:**
- Spring Web
- Spring Security
- Spring Data JPA
- MS SQL Server Driver
- Spring Boot DevTools
- Validation
- SpringDoc OpenAPI 3

### 2. Maven Dependencies (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.tcc</groupId>
    <artifactId>task-manager</artifactId>
    <version>1.0.0</version>
    <name>Task Manager Backend</name>
    <description>Enterprise Task Management System Backend</description>
    
    <properties>
        <java.version>17</java.version>
        <jwt.version>0.11.5</jwt.version>
        <springdoc.version>2.2.0</springdoc.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>com.microsoft.sqlserver</groupId>
            <artifactId>mssql-jdbc</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jwt.version}</version>
        </dependency>
        
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- API Documentation -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>${springdoc.version}</version>
        </dependency>
        
        <!-- Development Tools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <!-- Test Dependencies -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 3. Application Configuration (application.yml)

```yaml
# Application Configuration
spring:
  application:
    name: task-manager-backend
  
  # Database Configuration
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=TaskManagerDB;trustServerCertificate=true
    username: sa
    password: YourPassword123!
    driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver
  
  # JPA/Hibernate Configuration
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.SQLServerDialect
        format_sql: true
  
  # Security Configuration
  security:
    jwt:
      secret: mySecretKey123456789012345678901234567890
      expiration: 86400000 # 24 hours in milliseconds
      refresh-expiration: 604800000 # 7 days in milliseconds

# Server Configuration
server:
  port: 8080
  servlet:
    context-path: /api

# API Documentation
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    display-request-duration: true
    groups-order: desc

# Logging Configuration
logging:
  level:
    com.tcc.taskmanager: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

### 4. Development Configuration (application-dev.yml)

```yaml
# Development-specific configuration
spring:
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: create-drop
  
  # Enable H2 Console for development (optional)
  h2:
    console:
      enabled: false

# Enable debug logging in development
logging:
  level:
    root: INFO
    com.tcc.taskmanager: DEBUG
    org.springframework.web: DEBUG
    org.hibernate: DEBUG

# CORS configuration for development
cors:
  allowed-origins: http://localhost:4200
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
  allow-credentials: true
```

## 🗄️ Database Setup

### SQL Server Setup with Docker

```bash
# Pull and run SQL Server container
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" \
   -p 1433:1433 --name sqlserver \
   -d mcr.microsoft.com/mssql/server:2019-latest

# Connect to SQL Server and create database
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd \
   -S localhost -U sa -P "YourPassword123!" \
   -Q "CREATE DATABASE TaskManagerDB"
```

### Alternative: Local SQL Server

1. Install SQL Server Express
2. Create database: `TaskManagerDB`
3. Update connection string in `application.yml`

### Database Schema

The application will automatically create tables using JPA/Hibernate:

```sql
-- Users table
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Tasks table
CREATE TABLE tasks (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    priority NVARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    status NVARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
    due_date DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

## 🔧 Running the Application

### Development Mode

```bash
# Navigate to backend directory
cd backend

# Run with Maven
mvn spring-boot:run

# Or with profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Production Build

```bash
# Build JAR file
mvn clean package

# Run JAR
java -jar target/task-manager-1.0.0.jar
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/task-manager-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
# Build and run
mvn clean package
docker build -t task-manager-backend .
docker run -p 8080:8080 task-manager-backend
```

## 🔐 Security Configuration

### JWT Configuration

The application uses JWT tokens for authentication:

- **Access Token**: 24 hours expiration
- **Refresh Token**: 7 days expiration
- **Algorithm**: HMAC SHA-256
- **Storage**: Client-side (localStorage)

### CORS Configuration

CORS is configured to allow requests from the Angular frontend:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
```

## 📚 API Documentation

### Access Swagger UI

Once the application is running:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

### Main Endpoints

```
Authentication:
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/refresh        # Refresh token
POST /api/auth/logout         # User logout

Tasks:
GET    /api/tasks             # Get user tasks (with filters)
POST   /api/tasks             # Create new task
GET    /api/tasks/{id}        # Get task by ID
PUT    /api/tasks/{id}        # Update task
DELETE /api/tasks/{id}        # Delete task
PATCH  /api/tasks/{id}/status # Update task status
GET    /api/tasks/stats       # Get task statistics

Users:
GET    /api/users/profile     # Get user profile
PUT    /api/users/profile     # Update user profile
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=TaskServiceTest

# Run tests with coverage
mvn jacoco:prepare-agent test jacoco:report
```

### Integration Tests

```bash
# Run integration tests
mvn test -P integration-tests

# Test with different profiles
mvn test -Dspring.profiles.active=test
```

## 📊 Monitoring & Health

### Health Check Endpoints

```
GET /api/actuator/health      # Application health
GET /api/actuator/info        # Application info
GET /api/actuator/metrics     # Application metrics
```

### Application Metrics

Enable actuator in `application.yml`:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always
```

## 🚀 Production Deployment

### Environment Variables

```bash
# Database
export DB_HOST=your-db-host
export DB_NAME=TaskManagerDB
export DB_USERNAME=your-username
export DB_PASSWORD=your-password

# JWT
export JWT_SECRET=your-jwt-secret-key
export JWT_EXPIRATION=86400000

# Server
export SERVER_PORT=8080
export CORS_ORIGINS=https://your-frontend-domain.com
```

### Production Profile (application-prod.yml)

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://${DB_HOST}:1433;databaseName=${DB_NAME}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

security:
  jwt:
    secret: ${JWT_SECRET}
    expiration: ${JWT_EXPIRATION:86400000}

logging:
  level:
    root: WARN
    com.tcc.taskmanager: INFO
  file:
    name: logs/task-manager.log
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check SQL Server is running
   - Verify connection string
   - Ensure database exists

2. **CORS Errors**
   - Verify frontend URL in CORS configuration
   - Check allowed headers and methods

3. **JWT Token Issues**
   - Verify JWT secret key
   - Check token expiration
   - Validate token format

4. **Port Already in Use**
   ```bash
   # Find process using port 8080
   netstat -ano | findstr :8080
   
   # Kill process (Windows)
   taskkill /PID <process-id> /F
   ```

### Debugging

Enable debug logging:

```yaml
logging:
  level:
    com.tcc.taskmanager: DEBUG
    org.springframework.security: DEBUG
    org.springframework.web: DEBUG
```

## 📞 Support

For backend-specific issues:

1. Check application logs
2. Verify database connectivity
3. Test endpoints with Postman/curl
4. Review Swagger documentation
5. Check Spring Boot actuator health

---

**Backend Setup Complete!** The Spring Boot backend is now ready to serve the Angular frontend with enterprise-level task management capabilities.