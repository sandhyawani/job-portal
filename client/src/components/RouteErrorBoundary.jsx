import React from "react";
import { useRouteError, useNavigate, Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error("Route error boundary caught error:", error);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full shadow-lg text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertCircle size={28} />
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Unable to Load Page
        </h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          {error?.statusText ||
            error?.message ||
            "An unexpected error occurred while loading this page. Please try refreshing or return to opportunities."}
        </p>

        <div className="flex flex-col gap-2.5">
          <Button
            onClick={() => window.location.reload()}
            className="w-full rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
          >
            <RefreshCw size={14} /> Refresh Page
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 gap-2"
          >
            <ArrowLeft size={14} /> Go Back
          </Button>

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
