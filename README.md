# Study Planner 📚

> A modern, student-friendly EdTech SaaS application for organizing courses, managing assignments, tracking deadlines, and monitoring semester academic momentum.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Frontend-Ready-success)

---

## ✨ Features & Implemented Pages

### 1. 🏠 Landing Page (`/`)
- **Brand Hero:** Introduces the platform value proposition (*"Master your coursework. Never miss a deadline."*).
- **Interactive Teaser:** Mimics the live student dashboard with realistic workload cards.
- **Feature Highlights:** Course workspaces, urgency-based deadline management, and completion analytics.
- **3-Step Workflow:** Add Subjects &rarr; Log Deadlines &rarr; Track & Conquer.
- **Header & Footer:** Accessible navigation, CTAs, and prototype disclosures.

### 2. 🔐 Student Authentication (UI-Only Prototypes)
- **Login (`/login`):** Email & password inputs, show/hide password toggle, required field validation, and a one-click *"Fill Demo Password"* helper.
- **Sign Up (`/signup`):** Full name, student email, password validation (length and password-confirmation matching), and demo terms acknowledgment.
- *Notice: Client-side validation only. No personal credentials or tokens are transmitted.*

### 3. 📊 Dashboard (`/dashboard`)
- **Welcome Header:** Personalized greeting showing real-time urgent assignment counts.
- **4 Key Statistic Cards:**
  - **Total Subjects:** Direct count of active courses.
  - **Pending Tasks:** Highlighted count with urgent item badges.
  - **Completed Tasks:** Out of total logged tasks.
  - **Semester Completion:** Real-time percentage progress bar.
- **Upcoming Deadlines:** Pending tasks sorted by nearest submission date with relative date badges (*"Due tomorrow"*, *"Due in 2 days"*, *"Overdue"*).
- **Recent Tasks & Activity:** Latest created or updated tasks.
- **Subject Workload Breakdown:** Course-by-course progress visualization.
- **Productivity Tip:** Daily study habit advice.

### 4. 📁 My Subjects (`/subjects`)
- **Distinct Color Accents:** Visual course cards with top color strips and badges.
- **Course Metadata:** Course codes (`CS 201`, `PHYS 142`), instructors, credit hours, classroom locations, and syllabus notes.
- **Live Task Counters:** Pending vs. completed tasks per course with progress bar.
- **Add / Edit Subject Modal:** 8-color theme palette picker, required code and title validation.
- **Delete Subject Dialog:** Confirmation modal with warnings for cascading task removal.
- **Search Bar:** Real-time search across course names, codes, and instructors.

### 5. ✅ My Tasks (`/tasks`)
- **Status Filter Tabs:** *All*, *Pending (To-Do)*, *In Progress*, and *Completed*.
- **Multi-Filter & Search:** Filter by Course Subject, Priority Level (*Urgent*, *High*, *Medium*, *Low*), and Sort Order (*Earliest Deadline*, *Priority*, *Recently Added*).
- **One-Click Checkbox Completion:** Instantly marks assignments complete with celebratory feedback.
- **Add / Edit Task Modal:** Title, course association, due date picker, priority level, estimated duration, and assignment notes.
- **Expandable Notes:** Quick drawer for assignment rubrics, page numbers, and instructions.
- **Subject Deep Linking:** Filter tasks directly for a subject via URL parameter (`/tasks?subject=<id>`).

---

## 🎨 Design System

| Element | Specification | Purpose |
| :--- | :--- | :--- |
| **Deep Navy Primary** | `#0F172A` / `#1E293B` | Sidebar, primary headlines, dark contrast accents |
| **Coral Accent** | `#FF6358` / Hover `#EA4C41` | Primary CTAs, urgent badges, active indicators |
| **Soft Cream Canvas** | `#FAF8F5` / `#F5F1E9` | Gentle neutral backdrop for comfortable reading |
| **Cards & Elevation** | White `#FFFFFF` with `shadow-card` & `shadow-elevated` | Clean content hierarchy and subtle depth |
| **Typography** | `Plus Jakarta Sans` & `Inter` | High legibility for academic schedules |

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Context API ([`StudyContext.tsx`](file:///src/context/StudyContext.tsx)) with reactive calculations (`useMemo`).
- **Data Persistence:** Automatic synchronization with browser `localStorage` under `study_planner_subjects_v1` and `study_planner_tasks_v1`.
- **Demo Reset:** One-click *"Reset Demo Mock Data"* action in the sidebar to restore original starter datasets at any time.

---

## 📁 Project Structure

```text
c:\TaskTracker\
├── index.html                   # HTML entry point with typography preconnects
├── package.json                 # Dependencies and npm scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration (port 3000, host: true)
├── tailwind.config.js           # Theme extension (navy, coral, cream palettes)
├── postcss.config.js            # PostCSS plugins
├── .gitignore                   # Ignore rules for dependencies, build, and IDE
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # BrowserRouter and application route definitions
    ├── index.css                # Tailwind imports and custom scrollbar styles
    ├── types/
    │   └── index.ts             # Subject, Task, Priority, and DashboardStats types
    ├── context/
    │   └── StudyContext.tsx     # Centralized state, mock data, and toast dispatcher
    ├── components/
    │   ├── common/
    │   │   ├── Badge.tsx        # Priority badges, status pills, and course tags
    │   │   ├── Modal.tsx        # Accessible dialog with backdrop and ESC support
    │   │   └── ToastContainer.tsx # Floating notification stack
    │   ├── layout/
    │   │   ├── Navbar.tsx       # Landing page public header
    │   │   ├── Footer.tsx       # Landing page public footer
    │   │   └── AppLayout.tsx    # Authenticated sidebar layout with mobile drawer
    │   ├── subjects/
    │   │   ├── SubjectCard.tsx  # Course card with progress and action triggers
    │   │   └── SubjectModal.tsx # Add/Edit course modal with color palette
    │   └── tasks/
    │       ├── TaskItem.tsx     # Interactive task item with checkbox & edit
    │       └── TaskModal.tsx    # Add/Edit assignment modal
    └── pages/
        ├── LandingPage.tsx      # Public landing page (/)
        ├── LoginPage.tsx        # UI authentication demo (/login)
        ├── SignUpPage.tsx       # UI registration demo (/signup)
        ├── DashboardPage.tsx    # Student metrics & upcoming deadlines (/dashboard)
        ├── SubjectsPage.tsx     # Course workspaces (/subjects)
        └── TasksPage.tsx        # Comprehensive task management (/tasks)
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (verified on v22.15.0)
- npm v9+

### Installation & Running Locally

1. **Navigate to the workspace folder:**
   ```bash
   cd c:\TaskTracker
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   ```text
   http://localhost:3000
   ```

### Production Build & Type Checking

To compile the production build:
```bash
npm run build
```

To preview the production bundle locally:
```bash
npm run preview
```

---

## 🔮 Supabase Integration Roadmap (Next Phase)

The frontend is intentionally designed with clean abstractions in [`StudyContext.tsx`](file:///src/context/StudyContext.tsx), making it straightforward to connect to Supabase:

1. **Authentication:** Swap the mock handlers in `LoginPage.tsx` and `SignUpPage.tsx` with `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`.
2. **PostgreSQL Tables:**
   - `subjects` (`id`, `user_id`, `name`, `code`, `color`, `instructor`, `credit_hours`, `room`, `created_at`)
   - `tasks` (`id`, `user_id`, `subject_id`, `title`, `due_date`, `priority`, `status`, `notes`, `created_at`, `completed_at`)
3. **Row-Level Security (RLS):** Restrict read/write operations to authenticated `auth.uid() = user_id`.

---

## 📄 License

This project is a frontend prototype built for academic task tracking and productivity.

