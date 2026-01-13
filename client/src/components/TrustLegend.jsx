import { Badge } from "./ui/badge";

const TrustLegend = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-2">
        Company Trust Indicator
      </h3>

      <div className="flex flex-wrap gap-3 text-sm">
        <Badge className="bg-green-100 text-green-700 border border-green-300">
          HIGH
        </Badge>
        <span className="text-gray-600">Likely genuine company</span>

        <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300">
          MEDIUM
        </Badge>
        <span className="text-gray-600">Some details missing</span>

        <Badge className="bg-red-100 text-red-700 border border-red-300">
          LOW
        </Badge>
        <span className="text-gray-600">Unverifiable or suspicious info</span>
      </div>
    </div>
  );
};

export default TrustLegend;
