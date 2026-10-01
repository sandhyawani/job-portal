import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ExternalLink, Download, FileText, RefreshCw, X } from "lucide-react";
import { Button } from "../ui/button";

const ResumeModal = ({
  open,
  onClose,
  resumeUrl,
  candidateName = "Candidate",
  originalName = "Resume.pdf",
}) => {
  const [useDirect, setUseDirect] = useState(false);

  if (!resumeUrl) return null;

  // Standard Google Docs Viewer embedded url (renders PDF, DOC, DOCX seamlessly)
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    resumeUrl
  )}&embedded=true`;

  const previewSrc = useDirect ? resumeUrl : googleViewerUrl;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-4xl w-[95vw] h-[88vh] max-h-[88vh] p-0 flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-4 px-5 border-b border-slate-100 bg-slate-50/80 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-primary-100 text-primary-700 shrink-0">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-sm font-bold text-slate-900 truncate">
                {candidateName ? `${candidateName}'s Resume` : "Candidate Resume"}
              </DialogTitle>
              <span className="text-[11px] text-slate-500 truncate block">
                {originalName || "Document"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseDirect(!useDirect)}
              className="text-xs h-8 px-2.5 rounded-lg text-slate-600 hidden sm:flex items-center gap-1"
              title="Toggle Viewer Mode"
            >
              <RefreshCw size={12} />
              <span>{useDirect ? "Google Viewer" : "Direct Mode"}</span>
            </Button>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition"
              title="Open link in new tab"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>

            <a
              href={resumeUrl}
              download={originalName || "Resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              title="Download file"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </DialogHeader>

        {/* Embedded Document Viewer */}
        <div className="relative flex-1 w-full h-full bg-slate-100/60 overflow-hidden">
          <iframe
            src={previewSrc}
            title={`${candidateName} Resume`}
            className="w-full h-full border-0 bg-white"
            allowFullScreen
          />
        </div>

        {/* Helper Footer */}
        <div className="p-2.5 px-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <span>
            If the preview does not display immediately, use{" "}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 font-semibold underline"
            >
              Open in Tab
            </a>{" "}
            or{" "}
            <button
              onClick={() => setUseDirect(!useDirect)}
              className="text-primary-600 font-semibold underline cursor-pointer"
            >
              switch viewer mode
            </button>
            .
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs h-7 px-3 rounded-lg text-slate-600 hover:text-slate-900"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeModal;
