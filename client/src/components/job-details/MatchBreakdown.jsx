import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, AlertTriangle } from "lucide-react";

const MatchBreakdown = ({ match }) => {
  if (!match) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs mb-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Why this job matches you
            </h2>
            <p className="text-xs text-slate-500">
              Transparent analysis based on your saved profile and skills
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold text-indigo-600">
            {match.score}%
          </span>
          <span className="text-xs text-slate-400 block font-medium">Match</span>
        </div>
      </div>

      {/* Score points breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block">Skills</span>
          <span className="text-sm font-bold text-slate-900">
            {match.breakdown?.skills?.score || 0} / 40 pts
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block">Experience</span>
          <span className="text-sm font-bold text-slate-900">
            {match.breakdown?.experience?.score || 0} / 25 pts
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block">Location</span>
          <span className="text-sm font-bold text-slate-900">
            {match.breakdown?.location?.score || 0} / 15 pts
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block">Job Type & Salary</span>
          <span className="text-sm font-bold text-slate-900">
            {(match.breakdown?.jobType?.score || 0) + (match.breakdown?.salary?.score || 0)} / 20 pts
          </span>
        </div>
      </div>

      {/* Explanations list */}
      <div className="space-y-2 text-xs">
        {match.reasons?.map((reason, idx) => (
          <div key={idx} className="flex items-center gap-2 text-emerald-700 font-medium">
            <span>{reason}</span>
          </div>
        ))}
        {match.missingKeySkills?.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-2 text-amber-700 font-medium">
            <AlertTriangle size={13} className="shrink-0 text-amber-500" />
            <span>{skill} experience preferred</span>
          </div>
        ))}
      </div>

      {/* Profile improvement */}
      {match.score < 80 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Want to improve your match score?</span>
          <Link
            to="/profile"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Update your profile skills →
          </Link>
        </div>
      )}
    </div>
  );
};

export default MatchBreakdown;
