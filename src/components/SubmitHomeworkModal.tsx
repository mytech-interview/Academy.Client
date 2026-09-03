import React, { useRef, useState, useEffect } from 'react';
import { X, FileText, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { submitHomeWork, StudentHomeWork } from '../api/homeworks';

interface SubmitHomeworkModalProps {
  homework: StudentHomeWork;
  studentGuid: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

const ACCEPTED_EXTENSIONS = ['.docx', '.doc', '.pdf'];

export const SubmitHomeworkModal: React.FC<SubmitHomeworkModalProps> = ({
  homework,
  studentGuid,
  onClose,
  onSubmitted,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [answerText, setAnswerText] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setError('დაშვებულია მხოლოდ .docx, .doc, .pdf ფაილები');
      return;
    }
    setError(null);
    // TODO(backend): no real file-upload endpoint yet — for now we only
    // send the file name as filePath. Once POST /api/files/upload
    // (multipart) is available, upload the file there and put the
    // returned URL in filePath instead of the file name.
    setFileName(file.name);
  };

  const canSubmit = (answerText.trim().length > 0 || fileName.trim().length > 0) && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitHomeWork({
        homeworkId: homework.homeWorkId,
        studentGuid,
        studentAnswer: answerText.trim() || undefined,
        filePath: fileName.trim() || undefined,
      });
      setSubmittedSuccessfully(true);
      onSubmitted?.();
    } catch (err: any) {
      setError(err.message || 'დავალების გაგზავნა ვერ მოხერხდა');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-close the modal a couple of seconds after a successful submission
  useEffect(() => {
    if (!submittedSuccessfully) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [submittedSuccessfully, onClose]);

  if (submittedSuccessfully) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-sm font-black text-slate-900">
              დავალება წარმატებით გაიგზავნა!
            </h3>
            <p className="text-xs font-medium text-slate-500">
              თქვენი პასუხი მიღებულია და მალე განიხილება.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition cursor-pointer"
            >
              დახურვა
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <FileText className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-black text-slate-900">
              დავალების ჩაბარება (Word / Text)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-800">
              ტექსტური ნამუშევარი / კოდი / განმარტება
            </label>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="ჩაწერეთ თქვენი პასუხი ან პროექტის მიმოხილვა..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              Word / PDF ფაილის მიმაგრება (.docx, .doc, .pdf)
            </label>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-6 flex flex-col items-center gap-3 text-center">
              <FileText className="h-7 w-7 text-indigo-400" />
              <p className="text-xs font-bold text-slate-500">
                ატვირთეთ ნამუშევარი (.docx / .pdf)
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.doc,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handlePickFile}
                type="button"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-indigo-700 transition cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                ფაილის არჩევა კომპიუტერიდან
              </button>

              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="ან ჩაწერეთ ფაილის სახელი..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-black hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            გაუქმება
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            ჩაბარება
          </button>
        </div>
      </div>
    </div>
  );
};