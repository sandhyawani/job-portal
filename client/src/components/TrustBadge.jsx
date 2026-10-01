import React from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const trustStyles = {
  HIGH: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 border border-amber-200",
  LOW: "bg-rose-50 text-rose-700 border border-rose-200",
};

const trustLabel = {
  HIGH: "Verified",
  MEDIUM: "Partially Verified",
  LOW: "Unverified",
};

const trustMessage = {
  HIGH: "Verified company details. You can trust this is a real employer.",
  MEDIUM: "Company is missing some official details. Apply with caution.",
  LOW: "Unverified company. Exercise caution when applying.",
};

const TrustBadge = ({ trustLevel, showDetails = false }) => {
  if (!trustLevel || !trustStyles[trustLevel]) return null;

  const isHigh = trustLevel === "HIGH";

  return (
    <div className="inline-flex flex-col shrink-0" title={trustMessage[trustLevel]}>
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${trustStyles[trustLevel]}`}
      >
        {isHigh ? (
          <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
        ) : (
          <ShieldAlert size={11} className="text-amber-600 shrink-0" />
        )}
        <span>{trustLabel[trustLevel]}</span>
      </span>

      {showDetails && (
        <p className={`text-[10px] leading-snug mt-1 max-w-xs ${isHigh ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
          {isHigh ? "✓ " : "⚠ "}{trustMessage[trustLevel]}
        </p>
      )}
    </div>
  );
};

export default TrustBadge;
