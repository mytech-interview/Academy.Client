import React from 'react';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';

import ConsultationForm from '../components/ConsultationForm';
import FAQSection from '../components/FAQSection';
import { Language } from '../lib/translations';

interface ContactPageProps {
  lang: Language;
}

const contactContent = {
  ka: {
    title: 'საკონტაქტო ინფორმაცია',
    subtitle: 'მოგვწერეთ, დაგვირეკეთ ან გვეწვიეთ ჩვენს აკადემიურ სივრცეებში. ჩვენ ყოველთვის მზად ვართ გიპასუხოთ!',
    mainOffice: 'თბილისი (სათაო ოფისი)',
    kutaisiOffice: 'ქუთაისი ფილიალი',
    batumiOffice: 'ბათუმის ფილიალი',
    hoursValue: 'ორშაბათი - შაბათი, 10:00 - 20:00',
    tbilisiAddress: 'ალ. ყაზბეგის გამზირი 24, თბილისი',
    kutaisiAddress: 'რუსთაველის გამზირი 12, ქუთაისი',
    batumiAddress: 'მემედ აბაშიძის გამზირი 45, ბათუმი',
  },
  en: {
    title: 'Contact Information',
    subtitle: 'Get in touch with us via email, phone, or by visiting our branches. We are always happy to assist you!',
    mainOffice: 'Tbilisi (Head Office)',
    kutaisiOffice: 'Kutaisi Branch',
    batumiOffice: 'Batumi Branch',
    hoursValue: 'Monday - Saturday, 10:00 - 20:00',
    tbilisiAddress: '24 Al. Kazbegi Ave, Tbilisi',
    kutaisiAddress: '12 Rustaveli Ave, Kutaisi',
    batumiAddress: '45 Memed Abashidze Ave, Batumi',
  },
  ru: {
    title: 'Контактная информация',
    subtitle: 'Свяжитесь с нами по электронной почте, телефону или посетите наши филиалы. Мы всегда рады помочь!',
    mainOffice: 'Тбилиси (Главный офис)',
    kutaisiOffice: 'Кутаисский филиал',
    batumiOffice: 'Батумский филиал',
    hoursValue: 'Понедельник - Суббота, 10:00 - 20:00',
    tbilisiAddress: 'Тбилиси, пр. Ал. Казбеги 24',
    kutaisiAddress: 'Кутаиси, пр. Руставели 12',
    batumiAddress: 'Батуми, пр. Мемеда Абашидзе 45',
  },
};

export default function ContactPage({ lang }: ContactPageProps) {
  const contactLabels = contactContent[lang];

  const branches = [
    { title: contactLabels.mainOffice, addr: contactLabels.tbilisiAddress, phone: '+995 322 199 200', email: 'info@geoalfa.edu.ge' },
    { title: contactLabels.kutaisiOffice, addr: contactLabels.kutaisiAddress, phone: '+995 431 223 344', email: 'kutaisi@geoalfa.edu.ge' },
    { title: contactLabels.batumiOffice, addr: contactLabels.batumiAddress, phone: '+995 422 554 433', email: 'batumi@geoalfa.edu.ge' },
  ];

  return (
    <div className="pb-20 space-y-20 animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 sm:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-8 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 h-40 w-40 bg-indigo-500/5 blur-3xl rounded-full"></div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-rose-700 border border-rose-100">
              <Phone className="h-3.5 w-3.5" />
              {lang === 'ka' ? 'კავშირი' : lang === 'ru' ? 'Контакты' : 'Get In Touch'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none font-display">
              {contactLabels.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
              {contactLabels.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
            {branches.map((branch, bi) => (
              <div key={bi} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 space-y-4 hover:border-indigo-200 transition">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest font-mono block">
                    Branch {bi + 1}
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
                    <span>{contactLabels.hoursValue}</span>
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