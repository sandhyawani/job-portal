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
      <DialogContent className="sm:max-w-md bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center max-h-[90vh] overflow-y-auto">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 size={28} />
        </div>

        <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
          Application Submitted!
        </DialogTitle>
        <DialogDescription className="text-xs text-slate-500 mt-0.5">
          Your application has been delivered directly to the hiring team.
        </DialogDescription>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 my-3 text-left text-xs space-y-1.5">
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
            <span className="font-bold text-primary-600 uppercase text-[11px]">Applied (Under Review)</span>
          </div>
        </div>

        <div className="bg-primary-50/60 border border-primary-100 rounded-xl p-3 mb-4 text-left text-xs text-slate-600 leading-relaxed">
          <span className="font-bold text-primary-900 block mb-0.5">Next steps:</span>
          <p className="text-[11px] text-slate-600">
            You will be notified as soon as the recruiter reviews your application or schedules an interview round.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button
            onClick={onTrack}
            className="flex-1 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-xs"
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
