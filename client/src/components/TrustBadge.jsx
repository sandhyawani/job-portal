import React from "react";
import { Badge } from "./ui/badge";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const trustStyles = {
  HIGH: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-rose-50 text-rose-700 border-rose-200",
};

const trustLabel = {
  HIGH: "High Trust",
  MEDIUM: "Medium Trust",
  LOW: "Low Trust",
};

const trustTooltip = {
  HIGH: "Verified company with high trust rating",
  MEDIUM: "Company details are partially verified. Apply with caution.",
  LOW: "Company information may be unverified.",
};

const TrustBadge = ({ trustLevel, showWarning = false }) => {
  if (!trustLevel || !trustStyles[trustLevel]) return null;

  const isHigh = trustLevel === "HIGH";

  return (
    <div className="inline-flex flex-col items-start gap-1 shrink-0">
      <Badge
        title={trustTooltip[trustLevel]}
        className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded-md shadow-2xs whitespace-nowrap ${trustStyles[trustLevel]}`}
      >
        {isHigh ? (
          <ShieldCheck size={13} className="shrink-0" />
        ) : (
          <ShieldAlert size={13} className="shrink-0" />
        )}
        <span>{trustLabel[trustLevel]}</span>
      </Badge>

      {showWarning && !isHigh && (
        <p className="text-xs text-amber-700/90 leading-snug">
          ⚠ {trustTooltip[trustLevel]}
        </p>
      )}
    </div>
  );
};

export const CompanyVerificationSignals = ({ company, job }) => {
  const hasWebsite = Boolean(company?.website);
  const hasDescription = Boolean(company?.description && company.description.length > 15);
  const hasSalary = Boolean(job?.salary);

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        Observable Company Signals
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className={hasWebsite ? "text-emerald-600 font-bold" : "text-gray-400"}>
            {hasWebsite ? "✓" : "•"}
          </span>
          <span>{hasWebsite ? "Official website provided" : "Website not provided"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={hasDescription ? "text-emerald-600 font-bold" : "text-gray-400"}>
            {hasDescription ? "✓" : "•"}
          </span>
          <span>{hasDescription ? "Company profile information provided" : "Basic profile"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={hasSalary ? "text-emerald-600 font-bold" : "text-gray-400"}>
            {hasSalary ? "✓" : "•"}
          </span>
          <span>{hasSalary ? "Transparent compensation provided" : "Undisclosed compensation"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <span className="text-amber-500 font-bold">⚠</span>
          <span>Recruiter identity not independently third-party verified</span>
        </div>
      </div>
    </div>
  );
};

export default TrustBadge;
