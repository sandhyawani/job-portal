import { Badge } from "./ui/badge";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const trustStyles = {
  HIGH: "bg-green-100 text-green-700 border border-green-300",
  MEDIUM: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  LOW: "bg-red-100 text-red-700 border border-red-300",
};

const trustLabel = {
  HIGH: "High Trust",
  MEDIUM: "Medium Trust",
  LOW: "Low Trust",
};

const trustWarning = {
  MEDIUM: "Company details are partially verified. Apply with caution.",
  LOW: "Company information may be unreliable.",
};

const TrustBadge = ({ trustLevel }) => {
  if (!trustLevel || !trustStyles[trustLevel]) return null;

  const isHigh = trustLevel === "HIGH";

  return (
    <div className="mt-1 space-y-1 max-w-xs">
      <Badge
        className={`flex items-center gap-1 w-fit font-semibold ${trustStyles[trustLevel]}`}
      >
        {isHigh ? (
          <ShieldCheck size={14} />
        ) : (
          <ShieldAlert size={14} />
        )}
        {trustLabel[trustLevel]}
      </Badge>

      {!isHigh && (
        <p className="text-xs text-gray-500 leading-snug">
          ⚠ {trustWarning[trustLevel]}
        </p>
      )}
    </div>
  );
};

export default TrustBadge;
