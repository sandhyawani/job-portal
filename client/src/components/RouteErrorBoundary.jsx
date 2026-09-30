import React from "react";
import { useRouteError, useNavigate, Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

/**
 * RouteErrorBoundary — used as the react-router errorElement on every route.
 * Shows a clean, user-friendly page for 404s, failed data loads, and
 * unexpected runtime errors thrown during navigation/rendering.
 * Never exposes raw stack traces or minified bundle paths to users.
 */
const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Log in dev; suppress in prod
  if (import.meta.env.DEV) {
    console.error("[RouteErrorBoundary] Caught:", error);
  } else {
    console.error(
      "[RouteErrorBoundary] Runtime error | status:",
      error?.status,
      "| message:",
      error?.message ?? "unknown"
    );
  }

  // Determine user-friendly message (never expose technical details)
  const is404 = error?.status === 404;

  const friendlyMessage = is404
    ? "The page you're looking for doesn't exist or has been moved."
    : "Something went wrong while loading this page. Please try refreshing or go back.";

  const title = is404 ? "Page Not Found" : "Unable to Load Page";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full shadow-lg text-center">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertCircle size={28} />
        </div>

        {is404 && (
          <p className="text-5xl font-black text-slate-200 mb-1 leading-none">
            404
          </p>
        )}

        <h1 className="text-xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          {friendlyMessage}
        </p>

        <div className="flex flex-col gap-2.5">
          {/* Refresh (not for 404) */}
          {!is404 && (
            <Button
              onClick={() => window.location.reload()}
              className="w-full rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white gap-2"
            >
              <RefreshCw size={14} /> Try Again
            </Button>
          )}

          {/* Go Back */}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 gap-2"
          >
            <ArrowLeft size={14} /> Go Back
          </Button>

          {/* Home */}
          <Link to="/" className="w-full">
            <Button
              variant="ghost"
              className="w-full rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 gap-2"
            >
              <Home size={14} /> Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorBoundary;
