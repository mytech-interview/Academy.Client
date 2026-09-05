import React, { useRef, useState, useEffect } from 'react';
import { X, FileText, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { submitHomeWork, StudentHomeWork } from '../api/homeworks';

interface SubmitHomeworkModalProps {
  homework: StudentHomeWork;
  studentGuid: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

const ACCEPTED_EXTENSIONS = ['.doc', '.docx', '.pdf', '.txt', '.odt', '.rtf'];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const SubmitHomeworkModal: React.FC<SubmitHomeworkModalProps> = ({
  homework,
  studentGuid,
  onClose,
  onSubmitted,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [answerText, setAnswerText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = selected.name.slice(selected.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setError('დაშვებულია მხოლოდ .doc, .docx, .pdf, .txt, .odt, .rtf ფაილები');
      // Reset the input so the user can immediately retry with a valid file
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFile(null);
      return;
    }
    setError(null);
    setFile(selected);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const canSubmit = (answerText.trim().length > 0 || file !== null) && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitHomeWork({
        homeworkId: homework.homeWorkId,
        studentGuid,
        studentAnswer: answerText.trim() || undefined,
        file: file || undefined,
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

  const fileExt = file
    ? file.name.slice(file.name.lastIndexOf('.') + 1).toUpperCase()
    : '';

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
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-start gap-2.5">
            <FileText className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
            <h3 className="text-base font-black text-slate-900 leading-snug">
              დავალების ჩაბარება (PDF, Word, Excel)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800 block">
              ტექსტური ნამუშევარი / კოდი / განმარტება
            </label>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="ჩაწერეთ თქვენი პასუხი ან პროექტის მიმოხილვა..."
              rows={4}
              className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-800">
                სტუდენტის ნამუშევრის ფაილი (PDF, Word, Excel)
              </label>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                PDF • Word • Excel
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx,.pdf,.txt,.odt,.rtf"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3.5 flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-white border border-indigo-100 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-indigo-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
                      {fileExt}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                      ფაილი არჩეულია
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 truncate mt-1">
                    {file.name}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">
                    ზომა: {formatFileSize(file.size)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handlePickFile}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    შეცვლა
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <label
                onClick={(e) => {
                  e.preventDefault();
                  handlePickFile();
                }}
                className="flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-2xl border-2 border-dashed border-slate-300 text-center hover:bg-slate-50 hover:border-indigo-300 cursor-pointer transition"
              >
                <div className="h-11 w-11 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-indigo-500" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-700">
                    ჩააგდეთ ფაილი აქ ან{' '}
                    <span className="text-indigo-600 underline">
                      აირჩიეთ კომპიუტერიდან
                    </span>
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-1">
                    ატვირთეთ თქვენი მიერ მომზადებული PDF დოკუმენტი, Word (.docx) ან Excel (.xlsx) ფაილი.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">.PDF</span>
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">.DOCX / .DOC</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">.XLSX / .XLS</span>
                </div>
              </label>
            )}
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
            className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-black hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            გაუქმება
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            ჩაბარება
          </button>
        </div>
      </div>
    </div>
  );
};