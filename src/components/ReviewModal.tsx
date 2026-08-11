// components/ReviewModal.tsx
import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { upsertReview } from '../api/reviews';

interface ReviewModalProps {
  sessionId: number;
  studentGuid: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  sessionId,
  studentGuid,
  onClose,
  onSubmitted,
}) => {
  const [mark, setMark] = useState(5);
  const [hoverMark, setHoverMark] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await upsertReview({
        studentGuid,
        sessionId,
        mark,
        description,
      });
      onSubmitted?.();
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Не удалось отправить отзыв');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-black text-slate-950">
          სესიის / კურსის შეფასება (Review)
        </h3>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-600">შეფასება (1 - 5 ვარსკვლავი)</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHoverMark(n)}
                onMouseLeave={() => setHoverMark(null)}
                onClick={() => setMark(n)}
              >
                <Star
                  className={`h-7 w-7 ${
                    (hoverMark ?? mark) >= n
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200 fill-slate-200'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-600">კომენტარი / შენიშვნა</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="გააზიარეთ თქვენი აზრი სესიის და ლექტორის შესახებ..."
            className="w-full rounded-xl border border-slate-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
          >
            გაუქმება
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-[#5842F8] hover:bg-[#4832E6] text-white text-xs font-extrabold disabled:opacity-60"
          >
            {submitting ? '...' : 'გაგზავნა'}
          </button>
        </div>
      </div>
    </div>
  );
};