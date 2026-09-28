# JobPortal - Production-Grade Career & Hiring Platform

A full-stack, enterprise-ready job portal and applicant tracking system (ATS) connecting job seekers with hiring teams. Built on the MERN stack with strict role-based authorization, security hardening, multi-stage state machine application tracking, and an intelligent canonical skill-matching engine.

---

## Architecture & Tech Stack

```text
├── backend/
│   ├── controllers/      # Business logic (user, job, company, application)
│   ├── middlewares/      # Auth (isAuthenticated, requireRole), Upload (MIME validation), Security
│   ├── models/           # Mongoose schemas with compound indexes & lifecycle validation
│   ├── routes/           # Protected Express routers with strict role gates
│   ├── utils/            # DB connection, Cloudinary data URI generator
│   └── index.js          # Express app entrypoint (Helmet, Rate Limiters, CORS, Error Handler)
│
├── client/
│   ├── src/
│   │   ├── api/          # Centralized API service layer (axios client, interceptors, services)
│   │   ├── components/   # Modular UI components (auth, candidate, admin, job-details, shared)
│   │   ├── hooks/        # Custom React data-fetching hooks
│   │   ├── redux/        # Redux Toolkit state slices
│   │   ├── utils/        # Canonical skill matcher and constants
│   │   ├── App.jsx       # Route configuration with role-based ProtectedRoute
│   │   └── main.jsx      # Entrypoint with ErrorBoundary
│   ├── vite.config.js    # Vite bundler configuration
│   └── eslint.config.js  # Modern flat ESLint configuration
```

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, `express-rate-limit`, Bcrypt.js, HttpOnly JWT cookies
- **File Uploads**: Multer with strict MIME and extension validation (Images vs Documents)
- **Media Storage**: Cloudinary (profile avatars, resumes, company logos)

### Frontend
- **Framework**: React 18, Vite
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router DOM v6 with role-aware `ProtectedRoute`
- **Styling**: Tailwind CSS, Shadcn UI primitives, Lucide React icons
- **Notifications**: Sonner toast system
- **API Communication**: Centralized Axios instance with credentials & interceptors

---

## Core Features

### 1. For Candidates
- **Job Discovery & Multi-Criteria Filtering**: Filter by keyword, role, location, work mode (`Remote`, `Hybrid`, `On-site`), job type, experience, salary, and sort by relevance or date. URL query syncing preserves filter state across navigation.
- **Intelligent Job Matching**: Multi-attribute algorithm evaluating canonical skills (e.g. `js` -> `javascript`, `reactjs` -> `react`, `mongodb` -> `mongo`), experience alignment, location, and salary preferences to generate a 0-100% transparent match breakdown.
- **Pre-Submission Application Review**: Pre-flight review modal confirming contact details and resume before submission, preventing blind applications.
- **Application Status Machine**: Real-time lifecycle tracking (`Applied` → `Under Review` → `Shortlisted` → `Interview` → `Offer` → `Hired` or `Rejected`) with full transition history and recruiter notes.
- **Personal Job Pipeline**: Kanban board and list views categorizing active opportunities into `Saved`, `Applied`, `Interviewing`, and `Offers`.
- **External Applications Tracker**: Centralized tracker for jobs applied on LinkedIn, Indeed, Naukri, or company career pages.
- **Interview Preparation**: Interactive practice workspace tailored to candidate roles and skills with progress tracking.

### 2. For Recruiters
- **Actionable Hiring Workspace**: Real-time operational metrics tracking active openings, unreviewed applicants, upcoming interviews, and offers.
- **Applicant Pipeline Management**: Review resumes, update candidate stages with notes, and schedule interview dates.
- **Verified Company Branding**: Create and manage verified company profiles, logos, descriptions, and public company pages.
- **Strict Role Isolation**: Recruiter endpoints are strictly isolated—recruiters can only access, view, and modify jobs, companies, and applicants that belong to their account.

---

## Security & Reliability Hardening

| Security Layer | Implementation |
| :--- | :--- |
| **HTTP Headers** | `helmet` configured with `crossOriginResourcePolicy: { policy: "cross-origin" }` |
| **Rate Limiting** | General API limiter (300 req/15 min) + Auth limiter (30 req/15 min on login/register) |
| **Token Security** | JWTs delivered solely via `HttpOnly`, `SameSite=Lax`, `Secure` (production) cookies; excluded from JSON responses |
| **Password Hygiene** | Mongoose `select: false` on password hash to prevent accidental leakage in user queries |
| **Role Authorization** | Centralized `requireRole("student" \| "recruiter")` middleware enforcing strict endpoint separation |
| **Ownership Validation** | Explicit 403 authorization checks verifying resource owner on updates and deletes |
| **Database Integrity** | Compound unique index `{ job: 1, applicant: 1 }` on `Application` preventing duplicate submissions |
| **Upload Security** | Strict MIME type validation separating images (JPG, PNG, WEBP max 2MB) from documents (PDF, DOC, DOCX max 5MB) |
| **Error Handling** | Centralized error middleware masking internal stack traces in production environments |

---

## Application Lifecycle State Machine

The recruitment pipeline follows a formal state transition matrix:

```
[ pending ] ──────► [ review ] ──────► [ shortlisted ] ──────► [ interview ] ──────► [ offer ] ──────► [ hired ]
     │                   │                    │                      │                  │                  │
     ▼                   ▼                    ▼                      ▼                  ▼                  ▼
[ rejected ]        [ rejected ]         [ rejected ]           [ rejected ]       [ rejected ]       [ rejected ]
     │
     └──► Reopening: [ review ] or [ pending ]
```

Invalid transitions (e.g. `pending` directly to `hired` without review) are rejected with HTTP 400. Every state transition automatically records the actor, timestamp, previous status, and recruiter comments in `statusHistory`.

---

## Environment Variables

### Backend Configuration (`backend/.env`)
```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
SECRET_KEY=your_super_secret_jwt_key_at_least_32_chars
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend Configuration (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## Local Setup & Development

### 1. Prerequisites
- Node.js v18 or higher
- MongoDB instance (Local or MongoDB Atlas)
- Cloudinary account (for media uploads)

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
# Server listening on http://localhost:8000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
# Application accessible at http://localhost:5173
```

### 4. Production Build & Lint
```bash
# In client/
npm run lint    # ESLint validation (0 errors, 0 warnings)
npm run build   # Production bundle generation via Vite
```

---

## License
MIT
