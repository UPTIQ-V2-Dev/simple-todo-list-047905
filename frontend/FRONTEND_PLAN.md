# Todo List App - Technical Implementation Plan

## Project Overview

Simple todo list application with React 19, Vite, shadcn/ui, and Tailwind CSS v4. Features basic CRUD operations for todos with simple title field.

## Technology Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Axios with React Query for API calls
- **Form Handling**: React Hook Form with Zod validation

## Page-by-Page Implementation Plan

### 1. Login Page (`src/pages/LoginPage.tsx`)

**Components Required:**

- `LoginForm` - Main login form component

**Features:**

- Email and password input fields
- Form validation with Zod
- Login functionality with auth service
- Redirect to todo list after successful login
- Error handling and display
- Responsive design

**API Endpoints:**

- `POST /auth/login` - User authentication

**Utils/Hooks:**

- `loginValidation` - Zod schema for login validation
- Uses existing `authService.login` from `src/services/auth.ts`

**Types:**

- Uses existing `LoginRequest` from `src/types/user.ts`

### 2. Main Todo List Page (`src/pages/TodoListPage.tsx`)

**Components Required:**

- `TodoList` - Main container component
- `TodoItem` - Individual todo item display
- `TodoForm` - Add/edit todo form
- `TodoActions` - Delete/edit action buttons

**Features:**

- Display list of all todos
- Add new todo functionality
- Edit existing todo inline
- Delete todo with confirmation
- Empty state when no todos exist

**API Endpoints:**

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

**Utils/Hooks:**

- `useTodos` - Custom hook for todo operations
- `todoValidation` - Zod schema for todo validation

**Types:**

- `Todo` interface (id, title, completed, createdAt, updatedAt)
- `TodoFormData` type for form handling

## Component Structure

### Core Components

#### 1. `src/components/todo/TodoList.tsx`

- Main container for todo functionality
- Manages todo state and operations
- Handles loading and error states

#### 2. `src/components/todo/TodoItem.tsx`

- Individual todo display
- Toggle completion status
- Inline edit functionality
- Delete confirmation

#### 3. `src/components/todo/TodoForm.tsx`

- Form for adding/editing todos
- Input validation with Zod
- Submit/cancel actions

#### 4. `src/components/todo/EmptyState.tsx`

- Display when no todos exist
- Call-to-action for adding first todo

### UI Components (leveraging existing shadcn/ui)

- `Button` - For actions and form submissions
- `Input` - For todo title input
- `Checkbox` - For completion status
- `Card` - For todo item containers
- `Dialog` - For delete confirmations
- `Form` - For structured form handling
- `Skeleton` - For loading states

## Data Layer

### 1. Types (`src/types/todo.ts`)

```typescript
interface Todo {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

type TodoFormData = {
    title: string;
};
```

### 2. API Service (`src/services/todoApi.ts`)

- CRUD operations for todos
- Error handling and response types
- Integration with React Query

### 3. Custom Hooks (`src/hooks/useTodos.ts`)

- Centralized todo state management
- API integration with React Query
- Optimistic updates for better UX

## Validation & Utils

### 1. Validation (`src/lib/todoValidation.ts`)

- Zod schemas for todo data
- Form validation rules
- Error message definitions

### 2. Utils (`src/utils/todoUtils.ts`)

- Date formatting helpers
- Todo sorting and filtering utilities
- Local storage helpers (if needed)

## Layout & Navigation

### 1. App Layout (`src/App.tsx`)

- Main application wrapper
- Header with app title
- Center the todo list container

### 2. Header Component (`src/components/layout/Header.tsx`)

- App title "Simple Todo List"
- Basic styling with Tailwind

## Implementation Phases

### Phase 1: Basic Structure

1. Set up types and interfaces
2. Create basic component structure
3. Implement static UI with shadcn components

### Phase 2: State Management

1. Implement local state with React hooks
2. Add CRUD operations for todos
3. Form handling and validation

### Phase 3: API Integration

1. Set up API service layer
2. Integrate React Query for data fetching
3. Add error handling and loading states

### Phase 4: UX Enhancements

1. Add loading skeletons
2. Implement optimistic updates
3. Add delete confirmations
4. Polish styling and animations

## File Structure Overview

```
src/
├── components/
│   ├── todo/
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoForm.tsx
│   │   └── EmptyState.tsx
│   └── layout/
│       └── Header.tsx
├── hooks/
│   └── useTodos.ts
├── services/
│   └── todoApi.ts
├── types/
│   └── todo.ts
├── lib/
│   └── todoValidation.ts
├── utils/
│   └── todoUtils.ts
└── App.tsx
```

## Key Features Summary

- ✅ Simple, clean interface
- ✅ Add todos with title only
- ✅ Mark todos as complete/incomplete
- ✅ Edit todo titles inline
- ✅ Delete todos with confirmation
- ✅ Responsive design with Tailwind
- ✅ Type-safe with TypeScript
- ✅ Form validation with Zod
- ✅ Efficient data fetching with React Query
