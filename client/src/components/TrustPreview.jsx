import { Badge } from "./ui/badge";

const styles = {
  HIGH: "bg-green-100 text-green-700 border-green-300",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-300",
  LOW: "bg-red-100 text-red-700 border-red-300",
};

const TrustPreview = ({ trustLevel, trustScore }) => {
  if (!trustLevel) return null;

  return (
    <div className="mt-6 p-4 rounded-xl border bg-white shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-2">
        Company Trust Status
      </h3>

      <div className="flex items-center gap-3">
        <Badge className={`${styles[trustLevel]} font-semibold`}>
          {trustLevel} TRUST
        </Badge>
        <span className="text-sm text-gray-600">
          Score: <strong>{trustScore}/100</strong>
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Trust is calculated automatically based on the quality of information
        provided. Updating details can improve trust.
      </p>
    </div>
  );
};

export default TrustPreview;
