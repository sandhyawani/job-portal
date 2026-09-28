import React from "react";
import { Bookmark, Send, Calendar, Award } from "lucide-react";

const PipelineStats = ({
  savedCount,
  portalAppliedCount,
  externalAppliedCount,
  interviewCount,
  offerCount,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Saved Jobs</span>
          <Bookmark size={16} className="text-indigo-600" />
        </div>
        <div className="text-2xl font-black text-slate-900">{savedCount}</div>
        <span className="text-[11px] text-slate-400 mt-1 block">Ready to apply</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Applied</span>
          <Send size={16} className="text-blue-600" />
        </div>
        <div className="text-2xl font-black text-slate-900">
          {portalAppliedCount + externalAppliedCount}
        </div>
        <span className="text-[11px] text-slate-400 mt-1 block">
          {portalAppliedCount} portal · {externalAppliedCount} external
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Interviews</span>
          <Calendar size={16} className="text-amber-600" />
        </div>
        <div className="text-2xl font-black text-slate-900">{interviewCount}</div>
        <span className="text-[11px] text-slate-400 mt-1 block">Active rounds</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Offers</span>
          <Award size={16} className="text-emerald-600" />
        </div>
        <div className="text-2xl font-black text-slate-900">{offerCount}</div>
        <span className="text-[11px] text-slate-400 mt-1 block">Accepted & Offers</span>
      </div>
    </div>
  );
};

export default PipelineStats;
