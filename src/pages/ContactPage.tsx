import React from 'react';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import ConsultationForm from '../components/ConsultationForm';
import FAQSection from '../components/FAQSection';
import { Language } from '../lib/translations';

interface ContactPageProps {
  lang: Language;
}

export default function ContactPage({ lang }: ContactPageProps) {
  const { t } = useTranslation();

  const branches = [
    {
      title: 'თბილისის ფილიალი',
      addr: 'თბილისი',
      phone: '+995 568 80  584',
      email: 'contact@geoalphasolutions.com',
    },
    {
      title: 'ახალციხის ფილიალი',
      addr: 'ახალციხე',
      phone: '+995 568 80  584',
      email: 'contact@geoalphasolutions.com',
    },

  ];

  return (
    <div className="pb-20 space-y-20 animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 sm:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-8 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 h-40 w-40 bg-indigo-500/5 blur-3xl rounded-full"></div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-rose-700 border border-rose-100">
              <Phone className="h-3.5 w-3.5" />
              {t('contact.badge')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none font-display">
              {t('contact.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-left max-w-3xl mx-auto">
            {branches.map((branch, bi) => (
              <div key={bi} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 space-y-4 hover:border-indigo-200 transition">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest font-mono block">
                    {t('contact.branchLabel', { number: bi + 1 })}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm">{branch.title}</h3>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{branch.addr}</span>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex gap-2">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{branch.email}</span>
                  </div>
                  <div className="flex gap-2 border-t border-slate-200/50 pt-2.5 mt-2.5">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{t('contact.hoursValue')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConsultationForm lang={lang} />
      <FAQSection lang={lang} />
    </div>
  );
}