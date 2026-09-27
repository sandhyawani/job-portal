# JobPortal - Career & Hiring Workspace

A full-stack, production-grade job search and recruitment platform connecting job seekers with hiring teams. Features dedicated workspaces for candidates (discovery, matching, application tracking, saved jobs triage) and recruiters (job posting, applicant pipeline management, interview scheduling).

---

## Key Features

### For Candidates
- **Job Discovery & Multi-Criteria Filtering**: Filter by role, skill, company, location, work mode (Remote/Hybrid/On-site), job type, experience, salary, and date posted. URL search parameter syncing preserves filter state across page navigation.
- **Match Breakdown**: Transparent skill match evaluation comparing candidate profile skills against job requirements.
- **Pre-Submission Review & Confirmation**: Pre-submission profile and resume preview modal to prevent blind applications, followed by immediate post-submission confirmation and tracking link.
- **Real-Time Application Tracker**: 6-stage lifecycle progression (`Applied` → `Under Review` → `Shortlisted` → `Interview` → `Offer` → `Hired`) with rejection recovery recommendations.
- **Triaged Saved Jobs**: Organize bookmarked positions into `All Saved`, `To Apply`, and `Applied`.
- **External Applications Tracker**: Track job applications submitted on LinkedIn, Indeed, Naukri, or company sites in one unified dashboard.
- **Interview Preparation**: Built-in practice modules for core technical and behavioural interview rounds.

### For Recruiters
- **Actionable Dashboard**: Centralized triage queues for "Candidates Needing Review" and "Scheduled Candidate Interviews".
- **Hiring Pipeline**: Multi-stage applicant management with recruiter notes, interview scheduling, and automated candidate notifications.
- **Company Profile Management**: Company branding, logo uploads, and public company profiles.
- **Role-Based Security**: Strict access control preventing unauthorized recruiters from viewing or altering candidate data. Password hashes are excluded from all applicant payloads.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Redux Toolkit, React Router v6, Lucide React, Sonner
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, Multer, Cloudinary
- **Security**: Cookie-based HTTP-only authentication, CORS origin filtering, Trust Proxy, centralized error handling

---

## Project Structure

```text
├── backend/
│   ├── controllers/      # Route controllers (user, job, company, application)
│   ├── middlewares/      # Authentication & file upload middlewares
│   ├── models/           # Mongoose schemas (User, Job, Company, Application, Notification)
│   ├── routes/           # Express API route declarations
│   ├── utils/            # Database connection & helpers
│   ├── index.js          # Server entrypoint
│   └── package.json
│
├── client/
│   ├── public/           # Static assets & brand favicon
│   ├── src/
│   │   ├── components/   # React components (candidate workspace, recruiter dashboard, UI)
│   │   ├── hooks/        # Custom React hooks for data fetching
│   │   ├── redux/        # Redux slices (auth, job, company, application)
│   │   ├── utils/        # Constants and job matcher logic
│   │   ├── App.jsx       # Route definitions
│   │   └── main.jsx      # React entrypoint with Error Boundary
│   ├── index.html        # HTML root
│   ├── vite.config.js    # Vite configuration
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Job Portal sandhya"
```

### 2. Configure Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder based on `.env.example`:
```env
PORT=8000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```
Start the backend server:
```bash
npm start
# Server runs on http://localhost:8000
```

### 3. Configure Frontend
```bash
cd ../client
npm install
```
Optionally create `.env` in `client/` if using a custom backend URL:
```env
VITE_API_BASE_URL=http://localhost:8000
```
Start the development server:
```bash
npm run dev
# App opens at http://localhost:5173
```

### 4. Build for Production
```bash
cd client
npm run build
```

---

## License
MIT
