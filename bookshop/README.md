# Bookstore - Online Book Shop

A modern web application for purchasing books, built with React and TypeScript. This project implements a full-featured online bookstore with a book catalog, shopping cart, favorites system, and user account management.

## 🚀 Features

- **Book Catalog** - Browse new arrivals with pagination
- **Book Search** - Full-text search across the catalog
- **Book Details** - Detailed book pages with descriptions, ratings, and metadata
- **Shopping Cart** - Add books to cart with quantity management
- **Bookmarks (Favorites)** - Save your favorite books
- **Authentication** - User registration, login, and password recovery
- **User Account** - Profile management
- **Responsive Design** - Full support for mobile devices, tablets, and desktops
- **Adaptive Navigation** - Burger menu for mobile, sidebar with user profile for desktop

## 🛠 Tech Stack

### Core Technologies
- **React 19** - UI library for building user interfaces
- **TypeScript** - Typed JavaScript for code reliability
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching and caching
- **React Router v7** - Client-side routing

### Styling
- **CSS Modules** - Scoped styles for components
- **SCSS** - CSS preprocessor for global styles
- **Responsive Design** - Media queries for all screen sizes

### Validation & Typing
- **Zod** - Schema validation

## 📁 Project Structure

```
bookshop/
├── src/
│   ├── app/                    # Application configuration
│   │   ├── hooks.ts           # Custom Redux hooks
│   │   ├── routes.tsx         # Application routes
│   │   └── store.ts           # Redux store setup
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── books/             # Book-related components
│   │   ├── cart/              # Shopping cart components
│   │   ├── layout/            # Layout components (Header, Footer, Sidebar)
│   │   └── ui/                # Reusable UI components
│   ├── features/              # Redux slices and API
│   │   ├── api/               # RTK Query API endpoints
│   │   ├── auth/              # Authentication
│   │   ├── books/             # Book management
│   │   ├── bookmarks/         # Bookmarks
│   │   └── cart/              # Shopping cart
│   ├── helpers/               # Utility functions
│   ├── pages/                 # Application pages
│   ├── styles/                # Global styles
│   └── types/                 # TypeScript types
├── public/                    # Static files
└── package.json
```

## 🎨 Design Features

- **Modern UI** - Clean and minimalist interface
- **Responsiveness** - Support for all screen sizes (320px - 1920px+)
- **Accessibility** - Support for `prefers-reduced-motion` for better accessibility
- **Typography** - Bebas Neue font for headings
- **Color Scheme** - Soft pastel tones for book cards
- **Adaptive Navigation** - Smart menu system that adapts to screen size

## 📱 Responsive Breakpoints

- **Mobile**: up to 480px
- **Tablet**: 481px - 768px
- **Desktop (small)**: 769px - 1024px
- **Desktop (medium)**: 1025px - 1280px
- **Desktop (large)**: 1281px+

### Navigation Behavior

- **Desktop (> 1024px)**: 
  - Search bar visible in header
  - Bookmark and Cart icons in header
  - Profile button opens sidebar with user info and navigation
  - No search in sidebar (no duplication)

- **Tablet/Mobile (≤ 1024px)**:
  - Search bar hidden in header
  - Bookmark and Cart icons hidden
  - Burger menu button in top-right corner
  - Sidebar contains search, navigation links, and user profile
  - Sidebar opens from the right side

## 🚦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

Built files will be in the `dist/` folder

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📄 Application Pages

- `/` - Home page with new arrivals
- `/search?q=query` - Book search page
- `/book/:isbn13` - Book details page
- `/cart` - Shopping cart (requires authentication)
- `/bookmarks` - Bookmarks/Favorites (requires authentication)
- `/account` - User account (requires authentication)
- `/login` - Login/Registration page
- `/reset-password` - Password recovery
- `/new-password` - Set new password

## 🔐 Protected Routes

The following pages are only accessible to authenticated users:
- `/cart` - Shopping cart
- `/bookmarks` - Bookmarks
- `/account` - User account

Unauthenticated users will be redirected to the login page when attempting to access these routes.

## 🗂 State Management

The application uses Redux Toolkit for state management:

- **books** - Cache for book data
- **cart** - Shopping cart (persisted in localStorage)
- **bookmarks** - User bookmarks (persisted in localStorage)
- **auth** - Authenticated user data (persisted in localStorage)

## 🎯 Key Components

### UI Components
- `Button` - Button with various style variants
- `Input` - Input field with validation
- `Card` - Card component for content display
- `Modal` - Modal dialog
- `Pagination` - List pagination
- `Rating` - Rating component
- `Tabs` - Tab navigation
- `Skeleton` - Loading skeleton component

### Layout Components
- `Header` - Site header with search and navigation
  - Desktop: Search bar, bookmark/cart icons, profile button
  - Mobile: Logo, burger menu button
- `Footer` - Site footer
- `Sidebar` - Side navigation menu
  - Desktop: User profile, navigation links, logout button
  - Mobile: Search, user profile, navigation links, auth buttons
- `Layout` - Main application layout wrapper

## 🔧 Development Principles

- **SOLID** - Following object-oriented programming principles
- **KISS** - Keep it simple and straightforward
- **DRY** - Don't repeat yourself
- **Component-based** - Modular component architecture
- **Type Safety** - Strict TypeScript typing

## 📦 Key Dependencies

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.5",
  "@reduxjs/toolkit": "^2.9.2",
  "react-redux": "^9.2.0",
  "axios": "^1.13.1",
  "zod": "^4.1.12"
}
```

## 🌐 API

The application uses an external API for book data. All requests are handled through RTK Query with automatic caching and request deduplication.

## 🎨 Adaptive Menu System

The application features a smart adaptive navigation system:

1. **Desktop Experience**: 
   - Quick access icons (Bookmarks, Cart) in header
   - Profile button opens sidebar with user information
   - Search always available in header

2. **Mobile Experience**:
   - Burger menu for space efficiency
   - All navigation consolidated in sidebar
   - Search moved to sidebar to save header space
   - User profile information accessible via sidebar

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Development

The project uses modern development practices:
- TypeScript for type safety
- ESLint for code quality
- CSS Modules for style isolation
- Redux Toolkit for predictable state management
- Component-based architecture for maintainability

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open `http://localhost:5173` in your browser

---

**Version:** 0.0.0  
**Status:** In Development
