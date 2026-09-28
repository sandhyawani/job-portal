import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

/**
 * Class-based React ErrorBoundary.
 * Catches any runtime render/lifecycle errors that react-router's errorElement does NOT catch
 * (e.g. errors inside useState initializers, child renders, etc).
 *
 * Usage: wrap your top-level routes or component trees with <ErrorBoundary>.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorId: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true, errorId: Date.now().toString(36) };
  }

  componentDidCatch(error, info) {
    // In development: log full details. In production: avoid leaking internals.
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary] Caught error:", error);
      console.error("[ErrorBoundary] Component stack:", info?.componentStack);
    } else {
      console.error(
        "[ErrorBoundary] Runtime error caught. Error ID:",
        this.state.errorId,
        "| Message:",
        error?.message ?? "unknown"
      );
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorId: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, errorId: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full shadow-lg text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-5 border border-rose-100">
              <AlertCircle size={32} />
            </div>

            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              An unexpected error occurred while displaying this page.
              <br />
              Please try again or return to the home page.
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Try Again */}
              <button
                onClick={this.handleRetry}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition"
              >
                <RefreshCw size={15} />
                Try Again
              </button>

              {/* Go Home */}
              <button
                onClick={this.handleGoHome}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                <Home size={15} />
                Go to Home
              </button>
            </div>

            {import.meta.env.DEV && (
              <p className="mt-5 text-[10px] text-slate-400 font-mono">
                Error ID: {this.state.errorId}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
