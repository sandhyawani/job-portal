import { Badge } from "./ui/badge";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const trustStyles = {
  HIGH: "bg-green-100 text-green-700 border border-green-300",
  MEDIUM: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  LOW: "bg-red-100 text-red-700 border border-red-300",
};

const trustLabel = {
  HIGH: "Verified Employer",
  MEDIUM: "Partially Verified",
  LOW: "Unverified",
};

const trustMessage = {
  HIGH: "We have verified this company's legal details. You can trust this is a real employer.",
  MEDIUM: "This company is missing some official details. Apply with caution.",
  LOW: "Warning: We could not verify this company's legal existence. Be careful.",
};

const TrustBadge = ({ trustLevel, showDetails = false }) => {
  if (!trustLevel || !trustStyles[trustLevel]) return null;

  const isHigh = trustLevel === "HIGH";

  return (
    <div className="mt-1 space-y-1 max-w-xs" title={trustMessage[trustLevel]}>
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

      {(!isHigh || showDetails) && (
        <p className={`text-[10px] leading-snug ${isHigh ? "text-green-600 font-medium" : "text-gray-500"}`}>
          {isHigh ? "✓ " : "⚠ "}{trustMessage[trustLevel]}
        </p>
      )}
    </div>
  );
};

export default TrustBadge;
