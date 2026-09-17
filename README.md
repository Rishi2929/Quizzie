# Quizzie

Quizzie is a full-stack quiz creation and publishing platform that allows creators to build, publish, share, and analyze interactive quizzes.

The project was originally built with a JavaScript-based frontend/backend architecture and was incrementally migrated to **TypeScript**, while modernizing the UI, restructuring the frontend, and improving maintainability.

---

## Features

### Quiz Creation

- Create Q&A quizzes or polls
- Add multiple questions and answer options
- Support text, image, and text + image questions
- Configure question timers
- Select correct answers for Q&A quizzes
- Add, edit, reorder, and delete questions
- Client-side quiz validation

### Quiz Publishing

- Publish quizzes through a shareable public URL
- Copy and share quiz links
- Public quiz-taking experience
- Timer-based questions
- Progress tracking
- Answer selection and submission

### Dashboard

- Overview of created quizzes
- Total quizzes
- Total impressions
- Total questions
- Recently created quizzes
- Quick navigation to analytics and quiz creation

### Analytics

- Quiz-level impressions
- Quiz creation timestamps
- Question-level response analysis
- Correct and incorrect response statistics
- Poll response distribution
- Individual quiz analysis

### Authentication

- User registration
- User login
- Protected application routes
- HTTP-only authentication cookies
- Logout functionality
- Persistent authenticated sessions

---

## Tech Stack

### Frontend

- React
- TypeScript
- React Router
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- HTTP-only cookies

### Development

- Vite
- ESLint
- Git
- Postman

---

## Architecture

Quizzie follows a client-server architecture.

```text
                    ┌─────────────────────┐
                    │       Quizzie       │
                    │      Frontend       │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Express       │
                    │      Backend        │
                    │   TypeScript + JWT  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │     + Mongoose      │
                    └─────────────────────┘
```

## Frontend Structure

The frontend was reorganized around feature-oriented modules rather than keeping all quiz functionality inside large components.

```
src/
├── components/
│   ├── ui/
│   ├── Navbar.tsx
│   ├── ProtectedLayout.tsx
│   └── Skeleton.tsx
│
├── pages/
│   ├── landing/
│   │
│   ├── auth/
│   │   ├── AuthPage.tsx
│   │   └── components/
│   │       ├── LoginForm.tsx
│   │       └── SignupForm.tsx
│   │
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   │
│   ├── analytics/
│   │   ├── AnalyticsPage.tsx
│   │   └── QuestionAnalysisPage.tsx
│   │
│   ├── quiz/
│   │   ├── CreateQuizPage.tsx
│   │   ├── EditQuizPage.tsx
│   │   └── features/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       ├── types/
│   │       └── utils/
│   │
│   └── quizInterface/
│
└── App.tsx
```

The quiz editor is separated into reusable components, hooks, services, types, validation utilities, and constants.

## Backend Structure

The backend follows a layered Express architecture.

```
server/
├── controllers/
│   ├── quiz.controller.ts
│   └── user.controller.ts
│
├── data/
│   └── database.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
│
├── models/
│   ├── quiz.model.ts
│   └── user.model.ts
│
├── routes/
│   ├── quiz.routes.ts
│   └── user.routes.ts
│
├── services/
│
├── types/
│
├── index.ts
└── tsconfig.json
```

The backend was migrated from JavaScript to TypeScript with separate layers for:

- Routes

- Controllers

- Services

- Models

- Middleware

- Shared types

- Database configuration

## TypeScript Migration

Quizzie was incrementally migrated from JavaScript to TypeScript rather than being rewritten as a single large change.

The migration included:

- React components

- Quiz editor state

- Quiz models and interfaces

- API response types

- Quiz validation

- Backend controllers

- Express middleware

- Routes

- Mongoose models

- Services

- Database configuration

The migration also removed legacy JavaScript components and SCSS modules after their TypeScript/Tailwind replacements were introduced.

## UI Redesign

The application was redesigned around a consistent visual system.

### Design Principles

- Warm off-white application background

- Violet/indigo primary accent

- Rounded cards and controls

- Subtle shadows and gradients

- Generous whitespace

- Responsive layouts

- Reusable shadcn/ui components

- Subtle motion using Framer Motion

- Mobile-first responsive navigation

#### The redesign covers:

- Landing page

- Authentication

- Dashboard

- Quiz creation

- Quiz editing

- Quiz-taking interface

- Analytics

- Question analysis

- Publishing flow

## Authentication Flow

Quizzie uses cookie-based authentication.

```
User
 │
 ├── Register / Login
 │
 ▼
Backend
 │
 ├── Authenticate user
 ├── Generate authentication token
 └── Set HTTP-only cookie
 │
 ▼
Browser
 │
 └── Sends cookie with authenticated requests
 │
 ▼
Protected Routes
 │
 └── Authentication middleware
```
