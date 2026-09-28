import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Pipeline from "./components/candidate/Pipeline";
import ApplicationTracker from "./components/candidate/ApplicationTracker";
import CandidateDashboard from "./components/candidate/CandidateDashboard";
import InterviewPrep from "./components/candidate/InterviewPrep";
import CompanyDetail from "./components/company/CompanyDetail";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import RecruiterDashboard from "./components/admin/RecruiterDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import RouteErrorBoundary from "./components/RouteErrorBoundary";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/browse",
    element: <Browse />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={["student", "recruiter"]}>
        <Profile />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  // Candidate routes (Student only)
  {
    path: "/pipeline",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <Pipeline />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/saved",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <Pipeline />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/applications",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <ApplicationTracker />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <CandidateDashboard />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/interview-prep",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <InterviewPrep />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  // Public company profile
  {
    path: "/company/:id",
    element: <CompanyDetail />,
    errorElement: <RouteErrorBoundary />,
  },
  // Recruiter routes
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <RecruiterDashboard />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/jobs/:id/edit",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
