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

export default TrustBadge;
