# Enterprise Task Management System - Frontend

A modern, responsive task management application built with Angular 17+ and Material Design, featuring enterprise-level functionality with a Spanish user interface.

## 🚀 Features

### Core Functionality
- **JWT Authentication** - Secure login/register system with token refresh
- **Task Management** - Complete CRUD operations for tasks
- **Advanced Search & Filtering** - Multi-criteria search with real-time filtering
- **Dashboard Analytics** - Statistics and productivity insights
- **Responsive Design** - Optimized for mobile, tablet, and desktop

### Technical Features
- **Angular 17+** - Latest Angular features with standalone components
- **Material Design + Tailwind CSS** - Beautiful UI with utility-first styling
- **TypeScript** - Type-safe development
- **Reactive Forms** - Advanced form validation and user experience
- **HTTP Interceptors** - Automatic token handling and error management
- **Route Guards** - Protected routes and navigation security

## 🛠️ Technology Stack

- **Framework**: Angular 17+
- **UI Library**: Angular Material
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 9+
- Angular CLI 17+

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd task-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Ensure backend API is running on `http://localhost:8080`
   - API endpoints will be proxied via `proxy.conf.json`

4. **Start development server**
   ```bash
   npm start
   # or
   ng serve
   ```

5. **Access the application**
   - Frontend: http://localhost:4200
   - The app will automatically reload on file changes

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                      # Core services and guards
│   │   ├── guards/               # Route guards (auth.guard.ts)
│   │   ├── interceptors/         # HTTP interceptors
│   │   └── services/             # Core services (auth, task)
│   ├── shared/                   # Shared components and utilities
│   │   ├── models/              # TypeScript interfaces
│   │   └── constants/           # UI labels and constants
│   ├── features/                # Feature modules
│   │   ├── auth/               # Authentication components
│   │   ├── dashboard/          # Dashboard and analytics
│   │   ├── tasks/              # Task management
│   │   ├── profile/            # User profile
│   │   └── settings/           # Application settings
│   ├── layouts/                # Application layouts
│   │   └── main-layout/        # Main app layout with sidebar
│   ├── app.component.ts        # Root component
│   └── main.ts                 # Application bootstrap
├── assets/                     # Static assets
└── styles/                     # Global styles
```

## 🎨 Design System

### Material + Tailwind Integration
The application uses a unique combination of Angular Material components enhanced with Tailwind CSS utilities:

- **Material Components**: Complex UI elements (forms, tables, dialogs)
- **Tailwind Utilities**: Layout, spacing, colors, and responsive design
- **Custom Classes**: Component-specific styling combining both frameworks

### Color Palette
- **Primary**: Blue (#2196F3) - Main actions and navigation
- **Accent**: Orange (#FF9800) - Secondary actions and highlights  
- **Success**: Green (#4CAF50) - Success states and completed tasks
- **Warning**: Yellow (#FFC107) - Warning states and pending tasks
- **Error**: Red (#F44336) - Error states and high priority

### Responsive Breakpoints
- **Mobile**: 320px - 767px (hamburger menu, stacked layout)
- **Tablet**: 768px - 1023px (adapted layout)
- **Desktop**: 1024px+ (full layout with sidebar)

## 🌐 API Integration

### Backend Communication
The frontend communicates with a Spring Boot backend via REST API:

- **Base URL**: `http://localhost:8080/api`
- **Authentication**: JWT tokens in Authorization headers
- **Error Handling**: Centralized error interceptor with user-friendly messages
- **Auto-retry**: Token refresh on 401 errors

### API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/tasks` - Get user tasks with optional filters
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Secure token storage in localStorage
- Route protection with guards

### Data Validation
- Frontend form validation with real-time feedback
- TypeScript interfaces for type safety
- Sanitized user input
- Error boundary handling

## 📱 User Experience

### Spanish Interface
All user-facing text is in Spanish while maintaining English code:
- Form labels: "Iniciar Sesión", "Nueva Tarea", "Guardar"
- Navigation: "Panel Principal", "Mis Tareas", "Configuración"
- Messages: "Tarea creada exitosamente", "Error al guardar"
- Validation: "Este campo es requerido", "Email inválido"

### Accessibility
- ARIA labels and semantic HTML
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader friendly
- Focus management

### Performance
- Lazy loading of feature modules
- OnPush change detection where applicable
- Optimized bundle size with tree shaking
- Efficient HTTP caching strategies

## 🧪 Development

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration for code consistency
- Prettier for code formatting
- Angular best practices enforced

### Component Architecture
- Standalone components (Angular 17+ pattern)
- Smart/dumb component separation
- Reactive programming with RxJS
- Service-based state management

### Build & Deploy
```bash
# Development build
ng build

# Production build
ng build --configuration production

# Analyze bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## 🔧 Configuration

### Environment Variables
The application uses proxy configuration for API communication:

```json
// proxy.conf.json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: { /* blue palette */ },
        accent: { /* orange palette */ }
      }
    }
  },
  corePlugins: {
    preflight: false // Prevent conflicts with Material
  }
}
```

## 📈 Performance Optimizations

- **Lazy Loading**: Feature modules loaded on demand
- **OnPush Strategy**: Reduced change detection cycles
- **TrackBy Functions**: Optimized list rendering
- **HTTP Interceptors**: Efficient error handling and retry logic
- **Bundle Optimization**: Tree shaking and code splitting

## 🚀 Deployment

### Prerequisites
- Backend API running and accessible
- Database properly configured
- CORS enabled for frontend domain

### Build for Production
```bash
ng build --configuration production
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Container**: Docker with nginx
- **CDN**: AWS CloudFront, Azure CDN

## 🤝 Backend Integration

This frontend is designed to work with the Spring Boot backend. Ensure:

1. **Backend is running** on `http://localhost:8080`
2. **CORS is configured** to allow `http://localhost:4200`
3. **Database is set up** with proper schema
4. **JWT secret** is configured in backend

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [RxJS Documentation](https://rxjs.dev/)

## 📞 Support

For technical questions or issues:
1. Check the browser console for errors
2. Verify backend API is accessible
3. Review network requests in developer tools
4. Check authentication tokens in localStorage

---

**Enterprise Task Management System** - Built with Angular 17+, Material Design, and modern web standards for corporate productivity.