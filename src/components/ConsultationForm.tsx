import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, CheckCircle, MessageSquare, Send, User, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ConsultationForm() {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // Persist real inquiry in localStorage for offline durability
    const savedInquiries = localStorage.getItem('academy_consultation_inquiries');
    const list = savedInquiries ? JSON.parse(savedInquiries) : [];
    list.push({
      id: `inquiry-${Date.now()}`,
      name,
      phone,
      email: email || t('consultation.notSpecified'),
      date: new Date().toISOString()
    });
    localStorage.setItem('academy_consultation_inquiries', JSON.stringify(list));

    setSubmitted(true);
    // Clear inputs
    setName('');
    setPhone('');
    setEmail('');
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-950 rounded-[2.5rem] overflow-hidden shadow-xl border border-indigo-950 relative">
        {/* Abstract background graphics */}
        <div className="absolute right-0 top-0 bottom-0 left-1/2 opacity-25 pointer-events-none hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <circle cx="80" cy="50" r="30" fill="url(#grad1)" />
            <path d="M50 0 L100 0 L100 100 Z" fill="white" opacity="0.03" />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8 sm:p-12 relative z-10">
          {/* Left Info Column */}
          <div className="md:col-span-5 flex flex-col justify-between text-left text-white space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-300">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{t('consultation.badge')}</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                {t('consultation.title')}
              </h3>
              <p className="text-sm text-indigo-100/80 font-light leading-relaxed max-w-sm">
                {t('consultation.desc')}
              </p>
            </div>

            {/* Simulated Live status badge */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl max-w-xs">
              <div className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block leading-none text-emerald-300">{t('consultation.live')}</span>
                <span className="text-[10px] text-indigo-200 block mt-1">{t('consultation.avgTime')}</span>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col justify-center min-h-[300px]">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="space-y-4 text-left"
                >
                  <h4 className="text-base font-extrabold text-slate-900 leading-none mb-1">{t('consultation.formTitle')}</h4>
                  <p className="text-xs text-slate-500 mb-4 font-light">{t('consultation.formDesc')}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('consultation.labelName')}</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <User className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t('consultation.placeholderName')}
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs transition bg-slate-50"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('consultation.labelPhone')}</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Phone className="h-4 w-4" />
                        </span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t('consultation.placeholderPhone')}
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs transition bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('consultation.labelEmail')}</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@mail.ge"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs transition bg-slate-50"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition active:scale-[0.98] shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {t('consultation.btnSubmit')}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8 space-y-4 flex flex-col items-center justify-center"
                >
                  <div className="h-16 w-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                    <CheckCircle className="h-10 w-10 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="text-lg font-black text-slate-950">{t('consultation.successTitle')}</h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      {t('consultation.successDesc')}
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="rounded-xl border border-slate-200 px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    {t('consultation.btnNew')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}