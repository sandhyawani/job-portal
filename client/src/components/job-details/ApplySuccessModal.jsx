import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

const ApplySuccessModal = ({
  open,
  onOpenChange,
  singleJob,
  company,
  appliedDate,
  onTrack,
  onExplore,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>

        <DialogTitle className="text-xl font-black text-slate-900">
          Application Submitted!
        </DialogTitle>
        <DialogDescription className="text-xs text-slate-500 mt-1">
          Your application has been delivered directly to the hiring team.
        </DialogDescription>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-5 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Position:</span>
            <span className="font-bold text-slate-900">{singleJob?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Company:</span>
            <span className="font-semibold text-slate-800">{company?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Submitted:</span>
            <span className="font-medium text-slate-700">
              {appliedDate ? new Date(appliedDate).toLocaleDateString() : "Today"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="font-bold text-teal-600 uppercase text-[11px]">Applied (Under Review)</span>
          </div>
        </div>

        <div className="bg-teal-50/60 border border-teal-100 rounded-2xl p-3.5 mb-6 text-left text-xs text-slate-600 leading-relaxed">
          <span className="font-bold text-teal-900 block mb-1">Next steps:</span>
          <p className="text-[11px] text-slate-600">
            You will be notified as soon as the recruiter reviews your application or schedules an interview round.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button
            onClick={onTrack}
            className="flex-1 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
          >
            Track Application
          </Button>
          <Button
            variant="outline"
            onClick={onExplore}
            className="flex-1 rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Explore More Jobs
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplySuccessModal;
