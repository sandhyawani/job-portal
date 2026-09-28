import React from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";

const ExternalAppModal = ({
  open,
  onOpenChange,
  editingApp,
  formData,
  setFormData,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            {editingApp ? "Edit External Application" : "Track External Application"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Record opportunities you applied to outside JobPortal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3.5 mt-2">
          <div>
            <Label className="text-xs font-semibold text-slate-700">Company Name *</Label>
            <Input
              required
              placeholder="e.g. Google, TCS, Startup"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="mt-1 text-xs rounded-xl"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-700">Job Role / Title *</Label>
            <Input
              required
              placeholder="e.g. Frontend Engineer, Full Stack Dev"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 text-xs rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Source</Label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2 bg-white"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Naukri">Naukri</option>
                <option value="Indeed">Indeed</option>
                <option value="Company Website">Company Website</option>
                <option value="JobPortal">JobPortal</option>
                <option value="Wellfound">Wellfound</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Status</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2 bg-white capitalize"
              >
                <option value="applied">Applied</option>
                <option value="review">Under Review</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer Received</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Applied Date</Label>
              <Input
                type="date"
                value={formData.appliedDate}
                onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Salary (Optional)</Label>
              <Input
                placeholder="e.g. ₹12 LPA"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-700">Job URL</Label>
            <Input
              placeholder="https://..."
              value={formData.jobUrl}
              onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
              className="mt-1 text-xs rounded-xl"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-700">Notes & Contact</Label>
            <textarea
              placeholder="Interview notes, HR contact details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {editingApp ? "Save Changes" : "Add to Pipeline"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalAppModal;
