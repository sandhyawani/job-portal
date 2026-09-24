# 💼 JobPortal - Full-Stack Job Portal

A modern, full-stack Job Portal built using the **MERN (MongoDB, Express, React, Node.js)** stack. This application facilitates interaction between **Job Seekers (Students)** and **Recruiters**, enabling seamless job search, profile management, and hiring workflows, enriched with a **Company Trust Verification System**.

---

## 🌐 Live Demo & Deployment

* **Frontend (Vercel):** [https://job-portal-flax-omega.vercel.app](https://job-portal-flax-omega.vercel.app)
* **Backend API (Render):** [https://job-portal-fy3b.onrender.com](https://job-portal-fy3b.onrender.com)

---

## 🛡️ Key Features

### 👤 For Students (Job Seekers)
* **Auth & Profiles:** Registration & Login, profile picture upload, bio, skills input, and resume/CV upload (handled via Cloudinary).
* **Job Directory:** Browse and filter jobs by location, industry, salary range, and job titles.
* **Detailed Job Specifications:** View specific job descriptions, application counts, positions, salaries, and company trust levels.
* **Application Status Tracking:** Apply with one click and track application status (`Pending`, `Accepted`, `Rejected`) in real-time.

### 🏢 For Recruiters
* **Company Registration:** Create and manage company pages (Location, Logo, Website, Registration Number).
* **Job Posting & Management:** Post new positions or edit existing ones. Define required skills, experience level, description, salary, and available positions.
* **Applicant Screening:** View list of applicants for posted jobs, inspect their resumes, and update application status (`Accepted` or `Rejected`).
* **Company Verification:** Display trust level classifications to build credibility for applicants.

### 🌟 Distinct Feature: Company Trust Verification
* Companies are classified into **High**, **Medium**, and **Low** trust levels.
* Candidates receive visual badges and security alerts based on whether the recruiter's company profile is verified or has complete details.

---

## 🛠️ Tech Stack

### Frontend
* **Core:** [React 19](https://react.dev/), [Vite](https://vite.dev/) (Build tool)
* **Routing:** [React Router DOM v7](https://reactrouter.com/)
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [Redux Persist](https://github.com/rt2zz/redux-persist) (for persisted local session state)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Components & UI:** [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) (animations), [Embla Carousel](https://www.embla-carousel.com/)
* **Alerts/Toasts:** [Sonner](https://sonner.emilkowal.ski/), [React Hot Toast](https://react-hot-toast.com/)

### Backend
* **Runtime:** Node.js (ES Module format)
* **Framework:** Express.js
* **Database:** MongoDB via [Mongoose ODM](https://mongoosejs.com/)
* **Authentication:** JSON Web Tokens (JWT) & Cookies (`cookie-parser`)
* **File Uploads:** Multer, DataURI, and Cloudinary API (for media & resumes)
* **Security:** Bcrypt.js (Password hashing), CORS

---

## 📂 Project Architecture

```
job-portal/
├── backend/
│   ├── controllers/      # Route controllers (user, company, job, application)
│   ├── middlewares/      # Authentication & route guarding
│   ├── models/           # Mongoose schemas (User, Company, Job, Application)
│   ├── routes/           # Express router endpoints
│   ├── services/         # Custom service integrations
│   ├── utils/            # Helper utils (Database connection, Cloudinary configuration)
│   ├── index.js          # Express app entry point
│   └── package.json
└── client/
    ├── public/           # Static assets
    ├── src/
    │   ├── assets/       # React images and SVG assets
    │   ├── components/   # Application React components
    │   │   ├── admin/    # Recruiter-only screens (PostJob, Applicants, Companies)
    │   │   ├── auth/     # Login & Signup screens
    │   │   ├── ui/       # Custom Radix / styled primitives
    │   │   └── shared/   # Reusable layouts (Navbar, Footer)
    │   ├── hooks/        # Custom React hooks (fetch hooks)
    │   ├── redux/        # Redux slices and store configuration
    │   ├── utils/        # Constants and api endpoints helper
    │   ├── App.jsx       # App main component & routes definition
    │   ├── main.jsx      # React entry point
    │   └── index.css     # Global styles & Tailwind setups
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas cloud cluster)
* [Cloudinary Account](https://cloudinary.com/) (For file/resume upload support)

### Step 1: Clone the Repository
```bash
git clone https://github.com/sandhyawani/job-portal.git
cd job-portal
```

### Step 2: Configure the Backend Environment
Navigate to the `backend` folder and create a `.env` file:
```bash
cd backend
touch .env
```
Add the following keys to your `backend/.env`:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_uri
SECRET_KEY=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### Step 3: Run the Backend Server
```bash
npm install
npm run dev
```
The server will boot on `http://localhost:8000`.

### Step 4: Configure & Run the Frontend (Client)
Open a new terminal session, navigate to the `client` directory, configure environment URLs, and launch the dev server:
```bash
cd client
npm install
```
*Note: The frontend is pre-configured to communicate with the local server (`http://localhost:8000/api/v1`) via `client/src/utils/constant.js`.*

Start the development build:
```bash
npm run dev
```
Open `http://localhost:5173` in your web browser.

---

## 📡 API Endpoints

| Resource | Method | Endpoint | Description | Auth Required |
|---|---|---|---|---|
| **Users** | `POST` | `/api/v1/user/register` | Register student or recruiter | No |
| | `POST` | `/api/v1/user/login` | Login user and set JWT cookie | No |
| | `GET` | `/api/v1/user/logout` | Log out user and clear cookie | Yes |
| | `POST` | `/api/v1/user/profile/update` | Update user profile & upload resume | Yes |
| **Companies** | `POST` | `/api/v1/company/register` | Register a new company profile | Yes (Recruiter) |
| | `GET` | `/api/v1/company/get` | Get all companies created by user | Yes (Recruiter) |
| | `GET` | `/api/v1/company/get/:id` | Fetch specific company details | Yes |
| | `PUT` | `/api/v1/company/update/:id` | Update company profile (logo, name, etc.) | Yes (Recruiter) |
| **Jobs** | `POST` | `/api/v1/job/post` | Post a new job opening | Yes (Recruiter) |
| | `GET` | `/api/v1/job/get` | Retrieve all active job postings | No |
| | `GET` | `/api/v1/job/get/:id` | Fetch details of a specific job | Yes |
| | `GET` | `/api/v1/job/getadminjobs` | Retrieve all jobs posted by the logged-in admin | Yes (Recruiter) |
| **Applications** | `POST` | `/api/v1/application/apply/:id` | Apply for a specific job | Yes (Student) |
| | `GET` | `/api/v1/application/get` | Retrieve all jobs applied by the student | Yes (Student) |
| | `GET` | `/api/v1/application/:id/applicants` | View list of applicants for a job | Yes (Recruiter) |
| | `POST` | `/api/v1/application/status/:id/update` | Accept/reject applicant application | Yes (Recruiter) |

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
