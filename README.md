<h1 align="center">
  💼 JobPortal
</h1>

<h3 align="center">
  <em>Enterprise Career Workspace & Talent Acquisition Platform 🚀</em>
</h3>

<p align="center">
  <a href="https://job-portal-flax-omega.vercel.app" target="_blank"><img src="https://img.shields.io/badge/🔴_LIVE-job--portal--flax--omega.vercel.app-6366f1?style=for-the-badge&labelColor=0f172a" alt="Live Demo"/></a>
  <img src="https://img.shields.io/badge/version-2.0.0-818cf8?style=for-the-badge&labelColor=0f172a" alt="Version"/>
  <img src="https://img.shields.io/badge/license-MIT-a5b4fc?style=for-the-badge&labelColor=0f172a" alt="License"/>
</p>

<p align="center">
  <a href="https://job-portal-flax-omega.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀_LAUNCH_LIVE_APP-https%3A%2F%2Fjob--portal--flax--omega.vercel.app-2563eb?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Website"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Redux_Toolkit-Persist-764ABC?style=flat-square&logo=redux&logoColor=white" alt="Redux"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-Vite-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?style=flat-square&logo=cloudinary&logoColor=white" alt="Cloudinary"/>
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"/>
</p>

> ### 🌟 Live Production Website
> 🚀 **Explore the Live App:** **[https://job-portal-flax-omega.vercel.app](https://job-portal-flax-omega.vercel.app)**  
> 💻 **GitHub Repository:** **[https://github.com/sandhyawani/job-portal](https://github.com/sandhyawani/job-portal)**  
> 
> *Test candidate application flows, explore verified recruiter hiring pipelines, and practice interview prep questions live!*

---

## 💡 What is JobPortal?

**JobPortal** is a modern, full-stack career platform and Applicant Tracking System (ATS) designed to bring transparency and efficiency to modern hiring. Built from the ground up on the **MERN** stack, it provides dedicated workspaces for both job seekers and hiring teams:

- **For Job Seekers**: Go beyond traditional job boards with intelligent canonical skill matching, transparent scoring breakdowns, a pre-flight application preview modal, personal multi-source application pipelines, and interview practice tools.
- **For Hiring Teams**: An actionable recruiter headquarters with multi-stage candidate review pipelines, custom recruiter notes, interview scheduling, verified company trust badges, and rigorous role-based resource protection.

> **Empowering candidates to land dream roles while enabling hiring teams to build stellar organizations.** 🎯

---

## ✨ Feature Highlights

<table>
<tr>
<td width="50%" valign="top">

### 👨‍💻 For Candidates

#### 🔍 Smart Discovery & Multi-Filtering
Explore opportunities by role, keyword, location, salary range, job type, and work mode (**Remote**, **Hybrid**, **On-site**). URL search parameters automatically sync with your filter selections.

#### ⚡ Canonical Profile Match Engine
Evaluates your skills, experience, location, and salary preferences against role requirements. Transparent 0–100% scoring with exact match reasons and skill gap indicators.

#### 🛡️ Pre-Flight Application Review
Review your candidate contact information, uploaded resume, and cover note in a modal before confirming submission.

#### 📊 Unified Application Pipeline
Track all active applications across 6 formal lifecycle stages (**Applied** → **Under Review** → **Shortlisted** → **Interview** → **Offer** → **Hired**).

#### 🔖 Triaged Saved Jobs
Organize bookmarked positions into **All Saved**, **To Apply**, and **Applied** triage states.

#### 🌐 External Job Application Tracker
Manage opportunities applied to on LinkedIn, Indeed, Naukri, or direct company websites in one central dashboard.

#### 🎓 Interview Preparation Workspace
Practice curated technical, architectural, and behavioural interview questions tailored to your target job role.

</td>
<td width="50%" valign="top">

### 🏢 For Recruiters

#### 📈 Actionable Recruiter Operations
Real-time operations dashboard tracking active openings, unreviewed applicants, upcoming interviews, and offers extended.

#### 🎯 Multi-Stage Candidate Pipeline
Review candidate resumes, change candidate stages, write internal recruiter notes, and schedule interview dates.

#### 🏛️ Verified Company Trust Scores
A unique algorithm that calculates a **Trust Score (0-100)** for every registered company based on their official email domains, GST/Registration numbers, and web presence. Companies receive visual Trust Badges (🟢 High, 🟡 Medium, 🔴 Low) which are displayed to candidates on job postings, actively warning students about potentially unreliable employers.

#### 🔒 Strict Role-Based Access Control (RBAC)
Complete isolation between student and recruiter endpoints. Recruiters can only access and modify their own companies, jobs, and candidate pools.

#### 📋 Complete State Transition Audit
Every status change automatically records the timestamp, actor, previous status, and recruiter notes in the application audit log.

#### 🛡️ Resilient Error Handling
All routes are guarded with graceful fallback error boundaries and defensive data normalization for 100% crash-free navigation.

</td>
</tr>
</table>

---

## 🔧 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,redux,tailwind,vite,vercel" alt="Skills" />
</p>

| Layer | Technologies |
|:------|:-------------|
| **Frontend UI** | React 18, Vite, Tailwind CSS, Lucide React, Shadcn UI primitives, Sonner toasts |
| **State Management** | Redux Toolkit, Redux Persist (localStorage engine) |
| **API Client** | Centralized Axios service architecture (`authApi`, `jobApi`, `companyApi`, `applicationApi`, `userApi`) |
| **Backend API** | Node.js, Express 5, RESTful architecture |
| **Database** | MongoDB Atlas with Mongoose ODM (compound unique indexes & lifecycle validation) |
| **Authentication** | JWT delivered exclusively via `HttpOnly`, `SameSite=Lax`, `Secure` cookies; Bcrypt.js password hashing |
| **Security Hardening** | Helmet HTTP headers, express-rate-limit (API & Auth tier), strict CORS origin filtering |
| **File Storage** | Multer with strict MIME validation (Images vs Documents) & Cloudinary Media CDN |
| **Deployment** | Vercel (Frontend SPA), Render / Node runtime (Backend API) |

---

## 🏛️ System Architecture

```
JobPortal
├── 🎨 Frontend (React 18 + Vite + Tailwind CSS)
│   ├── api/ ──────────── Centralized Axios service layer (auth, job, company, application, user)
│   ├── components/
│   │   ├── auth/ ─────── Login, Register with role selector & avatar upload
│   │   ├── candidate/ ── CandidateDashboard, Pipeline, ApplicationTracker, InterviewPrep
│   │   ├── admin/ ────── RecruiterDashboard, PostJob, ApplicantsTable, CompanySetup
│   │   ├── job-details/  JobHeader, MatchBreakdown, JobContent, JobSidebar, ApplyModal
│   │   └── shared/ ───── Navbar, MobileBottomNav, RouteErrorBoundary, TrustBadge
│   ├── redux/ ────────── authSlice, jobSlice, companySlice, applicationSlice
│   └── utils/ ────────── Canonical jobMatcher token engine & constants
│
├── ⚙️ Backend (Node.js + Express 5)
│   ├── controllers/ ──── User, Job, Company, Application business logic
│   ├── middlewares/ ──── isAuthenticated, requireRole, strict Multer MIME validation
│   ├── models/ ───────── User, Job, Company, Application, ExternalApplication, Notification
│   ├── routes/ ───────── Role-guarded Express route handlers
│   └── utils/ ────────── MongoDB connection & DataURI Cloudinary handler
│
└── 🗄️ Database (MongoDB Atlas)
    └── Collections ───── users, jobs, companies, applications, externalapplications, notifications
```

---

## 🔄 Application Lifecycle State Machine

Candidate applications follow a formal state transition matrix to prevent race conditions and illegal status leaps:

```
[ pending ] ──────► [ review ] ──────► [ shortlisted ] ──────► [ interview ] ──────► [ offer ] ──────► [ hired ]
     │                   │                    │                      │                  │                  │
     ▼                   ▼                    ▼                      ▼                  ▼                  ▼
[ rejected ]        [ rejected ]         [ rejected ]           [ rejected ]       [ rejected ]       [ rejected ]
     │
     └──► Reopening: [ review ] or [ pending ]
```

- **Database-Level Integrity**: Compound unique index `{ job: 1, applicant: 1 }` guarantees zero duplicate submissions.
- **Audit History**: Every status transition stores `previousStatus`, `status`, `changedBy`, `changedAt`, and recruiter `comment`.

---

## 📂 Project Structure

<details>
<summary><b>📁 Backend Structure</b> (click to expand)</summary>

```
backend/
├── controllers/
│   ├── application.controller.js  # Apply, applicants triage, state machine status transitions
│   ├── company.controller.js      # Company registration, verified profiles, ownership
│   ├── job.controller.js          # Job posting, multi-criteria filtering, similar jobs
│   └── user.controller.js         # Register, HttpOnly login, profile update, save jobs
├── middlewares/
│   ├── isAuthenticated.js         # JWT cookie validation & requireRole middleware
│   └── mutler.js                  # Strict MIME validation (Images: 2MB, Documents: 5MB)
├── models/
│   ├── application.model.js       # Compound unique index & status history schema
│   ├── company.model.js           # Company schema with trust ratings
│   ├── externalApplication.model.js # External job applications tracker schema
│   ├── job.model.js               # Job listing schema with requirement tokens
│   ├── notification.model.js      # Real-time user notification schema
│   └── user.model.js              # User schema with select: false password protection
├── routes/
│   ├── application.route.js       # Protected application endpoints
│   ├── company.route.js           # Recruiter company management endpoints
│   ├── job.route.js               # Job search and recruiter posting endpoints
│   └── user.route.js              # Authentication and profile endpoints
├── utils/
│   ├── datauri.js                 # Cloudinary buffer converter
│   └── db.js                      # MongoDB connection pool
├── index.js                       # Server entrypoint with Helmet, RateLimit, CORS, Error Handler
└── package.json
```

</details>

<details>
<summary><b>📁 Frontend Structure</b> (click to expand)</summary>

```
client/src/
├── api/
│   ├── axios.js                   # Base Axios instance with withCredentials & interceptors
│   ├── authApi.js                 # Register, login, logout, profile update
│   ├── jobApi.js                  # Search jobs, get by id, post job, update job
│   ├── companyApi.js              # Company registration, public profiles, updates
│   ├── applicationApi.js          # Apply, pipeline status update, external applications
│   └── userApi.js                 # Saved jobs toggle, saved jobs list
├── components/
│   ├── admin/                     # Recruiter dashboard, applicants table, job posting
│   ├── auth/                      # Login and signup with role toggle
│   ├── candidate/                 # Candidate dashboard, pipeline kanban, interview prep
│   │   └── pipeline/              # PipelineStats, PipelineBoard, SavedJobsTab, ExternalTrackerTab
│   ├── company/                   # Company detail view
│   ├── job-details/               # JobHeader, MatchBreakdown, JobContent, JobSidebar, ApplyModal
│   ├── shared/                    # Navbar, MobileBottomNav, RouteErrorBoundary, TrustBadge
│   └── ui/                        # Reusable Tailwind UI components (Shadcn)
├── hooks/                         # Custom data hooks (useGetAllJobs, useGetAppliedJobs, etc.)
├── redux/                         # Redux slices (authSlice, jobSlice, companySlice, applicationSlice)
├── utils/                         # Canonical skill matcher engine & constants
├── App.jsx                        # Route configuration with ProtectedRoute & RouteErrorBoundary
└── main.jsx                       # React entrypoint
```

</details>

---

## 🔒 Security & Reliability Hardening

| Protection | Implementation |
|:-----------|:---------------|
| **JWT Cookie Security** | Delivered exclusively via `HttpOnly`, `SameSite=Lax`, `Secure` (production) cookies; token removed from JSON bodies |
| **Password Hygiene** | Mongoose `select: false` on password hashes; zero accidental leaks in queries |
| **Rate Limiting** | General API limiter (300 req/15 min) + Dedicated Auth limiter (30 req/15 min on login/register) |
| **HTTP Security Headers** | `helmet` configured with cross-origin resource policy |
| **CORS Protection** | Origin whitelisting supporting local dev and Vercel production domains |
| **File Upload Safety** | MIME & extension validation distinguishing 2MB images (JPG/PNG/WEBP) from 5MB resumes (PDF/DOC/DOCX) |
| **RBAC Authorization** | Centralized `requireRole("student" \| "recruiter")` with explicit 403 ownership checks |
| **Crash Protection** | Route error boundaries with defensive string normalization preventing runtime crashes |

---

## 🚀 Getting Started

### Prerequisites

```text
Node.js   ≥ v18.0.0
MongoDB   Local or MongoDB Atlas cluster
Cloudinary Cloudinary media account for resume & avatar uploads
```

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sandhyawani/job-portal.git
cd job-portal
```

### 2️⃣ Configure & Start Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=8000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
SECRET_KEY=your_jwt_secret_key_minimum_32_characters
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://job-portal-flax-omega.vercel.app
```

Start the backend server:

```bash
npm run dev
# Server running on http://localhost:8000
```

### 3️⃣ Configure & Start Frontend

```bash
cd ../client
npm install
```

Optionally configure `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
# Application accessible at http://localhost:5173
```

### 4️⃣ Production Build & Lint

```bash
cd client
npm run lint    # ESLint flat configuration (0 errors, 0 warnings)
npm run build   # Vite production build
```

---

## 🌐 Live Deployment & Quick Links

<p align="center">
  <a href="https://job-portal-flax-omega.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀_LAUNCH_LIVE_APPLICATION-job--portal--flax--omega.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live App" height="42"/>
  </a>
</p>

| Destination | Platform | Direct URL |
|:------------|:---------|:-----------|
| 🌐 **Live Web Application** | **Vercel** | **[https://job-portal-flax-omega.vercel.app](https://job-portal-flax-omega.vercel.app)** |
| 💻 **GitHub Repository** | **GitHub** | **[https://github.com/sandhyawani/job-portal](https://github.com/sandhyawani/job-portal)** |
| 🔍 **Candidate Job Search** | **Production** | **[https://job-portal-flax-omega.vercel.app/jobs](https://job-portal-flax-omega.vercel.app/jobs)** |
| 🏢 **Recruiter Headquarters** | **Production** | **[https://job-portal-flax-omega.vercel.app/admin/dashboard](https://job-portal-flax-omega.vercel.app/admin/dashboard)** |
| 🎓 **Interview Prep Hub** | **Production** | **[https://job-portal-flax-omega.vercel.app/interview-prep](https://job-portal-flax-omega.vercel.app/interview-prep)** |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <b>Sandhya Wani</b>
</p>
