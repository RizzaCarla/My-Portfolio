# Rizza Marzo Portfolio

A modern, secure portfolio application showcasing artwork, travel blogs, and personal information.

## Tech Stack

- **Frontend**: Vue 3 + Vuetify + Vite + Vue Router + Pinia
- **Backend**: Express.js + Node.js
- **Database**: MongoDB with Mongoose
- **Security**: Helmet.js, CORS, Rate limiting, Input validation

## Project Structure

```
RizzaMarzoPortfolio/
├── client/           # Vue 3 frontend application
├── server/           # Express.js backend server
├── .env             # Environment variables (create from .env.example)
├── package.json     # Root package with development scripts
└── README.md        # This file
```

## Quick Start

1. **Use Node 20 for this project**:
   ```bash
   nvm use    # Uses Node 20 (specified in .nvmrc)
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Configure environment**:
   ```bash
   # Edit .env file with your MongoDB connection string
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database
   ```

4. **Start development servers**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend
- `npm run dev:server` - Start only the backend
- `npm run build` - Build frontend for production
- `npm run start` - Start production server
- `npm run install:all` - Install dependencies for all parts

## Features

### Dashboard
- **Artwork Showcase**: Gallery of artistic creations
- **Travel Blogs**: Stories and experiences from travels
- **Personal Information**: About section with background
- **System Status**: Real-time backend connection monitoring

### Security Features (Built-in)
- ✅ Helmet.js security headers
- ✅ CORS protection with configurable origins
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation and sanitization
- ✅ Environment variable management
- ✅ MongoDB injection prevention

### Development Features
- Hot reload for both frontend and backend
- Vuetify Material Design components
- Vue Router for navigation
- Pinia for state management
- Modern ES modules throughout

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Security
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Next Steps

This is a foundation setup. You can now:

1. Add artwork and blog models to the database
2. Create API endpoints for CRUD operations
3. Implement authentication if needed
4. Add image upload functionality
5. Deploy to your preferred hosting platform

## Security Notes

- Never commit actual credentials to version control
- Update ALLOWED_ORIGINS for production deployment
- The application includes security best practices from the start
- All user inputs are validated and sanitized

## Development

The application uses a monorepo structure with concurrent development servers. Changes to either frontend or backend trigger hot reloads automatically.

For any issues, check that both servers are running and MongoDB connection is configured correctly.