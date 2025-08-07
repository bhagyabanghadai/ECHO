# ECHO Backend - Spring Boot

This is the Spring Boot backend for the ECHO platform - a voice-based emotional memory sharing application.

## 🚀 Features

- **JWT Authentication**: Secure token-based authentication
- **Memory Management**: Create, retrieve, and manage voice memories
- **Geospatial Queries**: Location-based memory discovery
- **Emotion Analysis**: AI-powered emotion detection and tagging
- **Memory Unlocking**: Echo system for emotional responses
- **RESTful API**: Complete REST API with OpenAPI documentation
- **PostgreSQL Integration**: Robust database with JPA/Hibernate

## 🛠️ Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **OpenAPI/Swagger** documentation
- **Maven** build tool

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

## 🔧 Setup & Installation

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE echo_db;
CREATE USER echo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE echo_db TO echo_user;
```

### 2. Environment Configuration

Create `application-local.yml` for local development:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/echo_db
    username: echo_user
    password: your_password

jwt:
  secret: your-super-secret-jwt-key-change-in-production
  expiration: 86400000

logging:
  level:
    com.echo.backend: DEBUG
```

### 3. Build & Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

## 📚 API Documentation

Once the application is running, access the API documentation at:

- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/api-docs

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register**: `POST /api/auth/signup`
2. **Login**: `POST /api/auth/login`
3. **Include token**: Add `Authorization: Bearer <token>` header to protected endpoints

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Memories
- `POST /api/memories` - Create new memory
- `GET /api/memories/nearby` - Get nearby memories
- `GET /api/memories/user` - Get user's memories
- `GET /api/memories/{id}` - Get memory by ID
- `POST /api/memories/{id}/unlock` - Unlock memory
- `GET /api/memories/{id}/unlocks` - Get memory unlocks

### Emotions
- `GET /api/emotions/map` - Get global emotion map data

### Waitlist
- `POST /api/waitlist` - Join waitlist

## 🗄️ Database Schema

The application uses the following main entities:

- **Users**: User accounts and profiles
- **Memories**: Voice memories with location and emotion data
- **MemoryUnlocks**: Echo responses to memories
- **EmotionProfiles**: User emotion analysis data
- **WaitlistUsers**: Pre-launch user registrations

## 🔧 Development

### Project Structure

```
src/main/java/com/echo/backend/
├── controller/     # REST controllers
├── service/        # Business logic
├── repository/     # Data access layer
├── model/          # JPA entities
├── dto/            # Data transfer objects
├── security/       # JWT and security config
├── config/         # Application configuration
└── exception/      # Custom exceptions
```

### Adding New Features

1. Create entity in `model/` package
2. Create repository interface in `repository/` package
3. Create service class in `service/` package
4. Create controller in `controller/` package
5. Add DTOs if needed in `dto/` package

### Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn test jacoco:report
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t echo-backend .

# Run container
docker run -p 8080:8080 echo-backend
```

### Production Configuration

For production deployment:

1. Set environment variables:
   - `DATABASE_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `PORT`

2. Use production profile:
   ```bash
   java -jar echo-backend.jar --spring.profiles.active=production
   ```

## 🔍 Monitoring

The application includes Spring Actuator for monitoring:

- Health check: `/api/actuator/health`
- Metrics: `/api/actuator/metrics`
- Info: `/api/actuator/info`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api/swagger-ui.html`
