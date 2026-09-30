import React from "react";
import { Plus, Building2, ExternalLink, Edit3, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";

const ExternalTrackerTab = ({
  externalApplications = [],
  onOpenAddModal,
  onDeleteExternal,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            External Applications
          </h2>
          <p className="text-xs text-slate-500">
            Manage applications submitted via LinkedIn, Naukri, Indeed, or company sites.
          </p>
        </div>
        <Button
          onClick={() => onOpenAddModal()}
          className="rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white gap-1"
        >
          <Plus size={15} /> Add Application
        </Button>
      </div>

      {externalApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Building2 size={32} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            No external applications tracked yet
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Track jobs you applied to on other platforms so you never lose track of an interview.
          </p>
          <Button
            onClick={() => onOpenAddModal()}
            className="mt-4 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white"
          >
            Add Your First Application
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Applied Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {externalApplications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3.5 font-bold text-slate-900">{app.company}</td>
                  <td className="p-3.5 text-slate-700 font-medium">{app.role}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {app.source}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {app.appliedDate?.split("T")[0]}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                        app.status === "interview"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : app.status === "offer"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : app.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-primary-50 text-primary-700 border border-primary-200"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-primary-600"
                          title="View URL"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => onOpenAddModal(app)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteExternal(app._id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExternalTrackerTab;
