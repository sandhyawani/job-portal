# JobPortal - Full-Stack Hiring Platform

A production-grade, full-stack job portal built on the **MERN stack** (MongoDB, Express, React, Node.js) with a fully enforced backend application pipeline, real take-home salary estimation, skill alignment scoring, company trust signals, and audit-trailed status history.

---

## Live Application

**Frontend (Vercel):** [https://job-portal-flax-omega.vercel.app](https://job-portal-flax-omega.vercel.app)

**Backend API (Render):** [https://job-portal-fy3b.onrender.com](https://job-portal-fy3b.onrender.com)

> Note: The backend is hosted on Render's free tier. The first request may take ~30 seconds to wake the server.

---

## Key Features

### For Candidates (Job Seekers)
- Register and log in with role-based authentication (JWT + Cookies).
- Upload profile photo and resume via Cloudinary.
- Add skills and bio to your profile.
- Browse all jobs or search by title, skill, or location.
- View real-time **In-Hand Take-Home Salary Estimates** (Indian New Tax Regime) before applying.
- See a **Skill Alignment Score** for every job listing based on your profile skills.
- Apply to jobs with a single click (duplicate protection enforced at backend).
- Track full application history with a live **Application Timeline** — stage, date, and recruiter comment for every status change.
- Save jobs and manage a personal saved jobs list.

### For Recruiters
- Register and manage company profiles (logo, website, description).
- Post, edit, and manage job listings.
- View all applicants per job posting.
- Move applicants through an **enforced hiring pipeline**:

```
Applied → Under Review → Shortlisted → Interview → Offer → Hired
```

  Terminal states: `Rejected`, `Withdrawn`.
- Illegal transitions (e.g. jumping directly to Hired) are rejected at the API level.
- Every status change is written to `statusHistory` with actor, timestamp, and optional comment.

### Security and Data Integrity
- Cross-recruiter authorization: Recruiter A cannot view or modify Recruiter B's data.
- Candidates cannot modify application status.
- Duplicate applications blocked at the database level.
- Invalid ObjectId requests handled safely (400, not 500).
- Unauthenticated requests receive 401 Unauthorized.
- **15 / 15 automated security and pipeline tests passing.**

### Company Trust Signals
- Companies are rated **High / Medium / Low** based on observable data points.
- Trust badge displayed on every job card and job detail page.
- Honest disclaimer that recruiter identity is not independently third-party verified.

---

## Tech Stack

### Frontend
| Category | Technology |
|---|---|
| Framework | React 18, Vite |
| Routing | React Router v6 |
| State | Redux Toolkit, Redux Persist |
| Styling | Tailwind CSS v4 |
| UI Primitives | Radix UI, Lucide React, Embla Carousel |
| Notifications | Sonner |

### Backend
| Category | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | MongoDB via Mongoose |
| Auth | JWT + cookie-parser |
| File Uploads | Multer + Cloudinary |
| Security | Bcrypt.js, CORS |

---

## Project Structure

```
job-portal/
├── backend/
│   ├── controllers/        # Business logic (user, company, job, application)
│   ├── middlewares/        # Auth guards and role checks
│   ├── models/             # Mongoose schemas (User, Company, Job, Application)
│   ├── routes/             # Express route definitions
│   ├── tests/              # Automated security and pipeline test suite
│   ├── utils/              # DB connection, Cloudinary config
│   └── index.js            # App entry point
└── client/
    └── src/
        ├── components/
        │   ├── admin/      # Recruiter-only screens
        │   ├── auth/       # Login, Signup
        │   ├── shared/     # Navbar, Footer
        │   └── ui/         # Radix UI primitives
        ├── hooks/          # Custom data-fetching hooks
        ├── redux/          # Store, slices
        └── utils/          # Constants, salaryCalculator, skillMatcher
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/sandhyawani/job-portal.git
cd job-portal
```

### 2. Configure the backend
Create `backend/.env` with:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_uri
SECRET_KEY=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### 3. Start the backend
```bash
cd backend
npm install
npm run dev
```
Backend runs at `http://localhost:8000`.

### 4. Start the frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## API Reference

| Resource | Method | Endpoint | Description | Auth |
|---|---|---|---|---|
| Users | POST | /api/v1/user/register | Register as student or recruiter | No |
| | POST | /api/v1/user/login | Login and receive JWT cookie | No |
| | GET | /api/v1/user/logout | Log out and clear cookie | Yes |
| | POST | /api/v1/user/profile/update | Update profile and resume | Yes |
| Companies | POST | /api/v1/company/register | Register a new company | Recruiter |
| | GET | /api/v1/company/get | List companies owned by recruiter | Recruiter |
| | PUT | /api/v1/company/update/:id | Update company profile | Recruiter |
| Jobs | POST | /api/v1/job/post | Post a new job | Recruiter |
| | GET | /api/v1/job/get | List all active jobs | No |
| | GET | /api/v1/job/get/:id | Get single job detail | Yes |
| | GET | /api/v1/job/getadminjobs | List recruiter's own jobs | Recruiter |
| Applications | POST | /api/v1/application/apply/:id | Apply for a job | Student |
| | GET | /api/v1/application/get | Get all applications by student | Student |
| | GET | /api/v1/application/:id/applicants | Get applicants for a job | Recruiter |
| | POST | /api/v1/application/status/:id/update | Advance pipeline status | Recruiter |

---

## Testing

```bash
cd backend
npm test
```

Expected output:
```
TEST SUMMARY: 15 / 15 PASSED
```

---

## License

This project is open-source under the [ISC License](LICENSE).
