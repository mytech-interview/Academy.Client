import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Tag, Sparkles, Check, Copy, Flame, Calendar, BookOpen, Gift, Users } from 'lucide-react';
import { Language } from '../lib/translations';

interface SpecialOffersProps {
  lang: Language;
  onSelectCoursesTab: () => void;
  onOpenConsultation: () => void;
}

export default function SpecialOffers({ lang, onSelectCoursesTab, onOpenConsultation }: SpecialOffersProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Timer calculations
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 42,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const labels = {
    ka: {
      badge: 'სპეციალური შემოთავაზებები',
      title: 'აქციები და ფასდაკლებები',
      subtitle: 'ისარგებლე სპეციალური პირობებით, კომბინირებული პაკეტებითა და საგრანტო პროგრამებით. დაიწყე სწავლა საუკეთესო ფასად!',
      urgency: 'შემოთავაზება ძალაშია კიდევ:',
      days: 'დღე',
      hours: 'საათი',
      minutes: 'წუთი',
      seconds: 'წამი',
      copyCode: 'კოდის კოპირება',
      copied: 'კოპირებულია!',
      getConsult: 'კონსულტაცია',
      enrollBtn: 'კურსებზე გადასვლა',
      featuresTitle: 'პაკეტში შედის:',
      activeBadge: 'აქტიურია',
      limitedBadge: 'შეზღუდული'
    },
    en: {
      badge: 'Special Opportunities',
      title: 'Promotions & Discounts',
      subtitle: 'Take advantage of bundle packages, active scholarships, and seasonal offers. Launch your career under the best terms!',
      urgency: 'Offer ends in:',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Min',
      seconds: 'Sec',
      copyCode: 'Copy Code',
      copied: 'Copied!',
      getConsult: 'Consultation',
      enrollBtn: 'Browse Courses',
      featuresTitle: 'Included in bundle:',
      activeBadge: 'Active',
      limitedBadge: 'Limited Time'
    },
    ru: {
      badge: 'Специальные возможности',
      title: 'Акции и Скидки',
      subtitle: 'Воспользуйтесь пакетными предложениями, грантами и сезонными скидками. Начните обучение на лучших условиях!',
      urgency: 'Срок действия предложения истекает через:',
      days: 'Дн',
      hours: 'Ч',
      minutes: 'Мин',
      seconds: 'Сек',
      copyCode: 'Копировать',
      copied: 'Скопировано!',
      getConsult: 'Консультация',
      enrollBtn: 'Перейти к курсам',
      featuresTitle: 'В пакет входит:',
      activeBadge: 'Активен',
      limitedBadge: 'Ограничено'
    }
  }[lang];

  const offers = [
    {
      id: 'promo-1',
      badge: lang === 'ka' ? '30% ფასდაკლება' : lang === 'en' ? '30% Off' : 'Скидка 30%',
      title: lang === 'ka' ? 'Full-Stack კომბო პაკეტი' : lang === 'en' ? 'Full-Stack Combo Bundle' : 'Full-Stack Комбо-пакет',
      subtitle: lang === 'ka' ? 'შეისწავლე ვებ-პროგრამირება (React & Node.js) და UI/UX დიზაინი ერთად.' : lang === 'en' ? 'Learn web programming (React & Node.js) and UI/UX Design together.' : 'Изучите веб-программирование (React & Node.js) и UI/UX дизайн вместе.',
      oldPrice: '2500 ₾',
      price: '1750 ₾',
      code: 'ALPHASTACK30',
      icon: Sparkles,
      color: 'from-indigo-600 to-violet-600',
      features: lang === 'ka' ? [
        'სრული ვებ პროგრამირების კურსი',
        'UI/UX დიზაინის საბაზისო კურსი',
        '3 რეალური პორტფოლიო პროექტი',
        'დასაქმების ხელშეწყობა პარტნიორებში',
        'ულიმიტო წვდომა მასალებზე'
      ] : lang === 'en' ? [
        'Full Web Programming course',
        'UI/UX Design basics course',
        '3 real portfolio projects',
        'Career support with partners',
        'Unlimited access to materials'
      ] : [
        'Полный курс веб-программирования',
        'Базовый курс UI/UX дизайна',
        '3 реальных проекта для портфолио',
        'Содействие в трудоустройстве',
        'Безлимитный доступ к материалам'
      ]
    },
    {
      id: 'promo-2',
      badge: lang === 'ka' ? 'ფასდაკლების ვაუჩერი' : lang === 'en' ? 'Discount Voucher' : 'Ваучер на скидку',
      title: lang === 'ka' ? 'სეზონური AI & Python ინტენსივი' : lang === 'en' ? 'Seasonal AI & Python Intensive' : 'Сезонный AI & Python Интенсив',
      subtitle: lang === 'ka' ? 'დაიწყე პროგრამირების შესწავლა Python-ით და აითვისე AI ინსტრუმენტები.' : lang === 'en' ? 'Start programming with Python and master artificial intelligence tools.' : 'Начните программировать на Python и освойте инструменты ИИ.',
      oldPrice: '1200 ₾',
      price: '890 ₾',
      code: 'AIPYTHON25',
      icon: Flame,
      color: 'from-amber-500 to-rose-500',
      features: lang === 'ka' ? [
        'Python პროგრამირების საფუძვლები',
        'მუშაობა OpenAI & Google Gemini APIs-თან',
        'ჩატბოტების და ავტომატიზაციების აგება',
        'პერსონალური მენტორის მხარდაჭერა',
        'სერთიფიკატი პროექტის დაცვის შემდეგ'
      ] : lang === 'en' ? [
        'Python Programming Fundamentals',
        'Working with OpenAI & Google Gemini APIs',
        'Building chatbots & automations',
        'Personal mentor support',
        'Certificate upon project defense'
      ] : [
        'Основы программирования на Python',
        'Работа с API OpenAI и Google Gemini',
        'Создание чат-ботов и автоматизаций',
        'Поддержка личного ментора',
        'Сертификат после защиты проекта'
      ]
    },
    {
      id: 'promo-3',
      badge: lang === 'ka' ? 'საჩუქარი სტუდენტებს' : lang === 'en' ? 'Student Gift' : 'Подарок студентам',
      title: lang === 'ka' ? 'მეგობრის მოწვევის პროგრამა' : lang === 'en' ? 'Refer-A-Friend Reward' : 'Программа "Приведи друга"',
      subtitle: lang === 'ka' ? 'მოიწვიე მეგობარი აკადემიაში და ორივე მიიღებთ საჩუქრად 150 ლარიან ვაუჩერს ნებისმიერ კურსზე.' : lang === 'en' ? 'Invite a friend to the academy and both get a 150 GEL gift voucher for any course.' : 'Пригласите друга в академию и оба получите подарочный ваучер на 150 лари.',
      price: '150 ₾ + 150 ₾',
      code: 'REFERFRIEND',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      features: lang === 'ka' ? [
        '150 ლარიანი ფასდაკლება შენთვის',
        '150 ლარიანი ფასდაკლება შენი მეგობრისთვის',
        'აქტიურდება მეგობრის რეგისტრაციისთანავე',
        'შესაძლებელია სხვა აქციებთან გაერთიანება',
        'ულიმიტო მოწვევების რაოდენობა'
      ] : lang === 'en' ? [
        '150 GEL discount for you',
        '150 GEL discount for your friend',
        'Activates upon friend\'s enrollment',
        'Can be combined with other promos',
        'Unlimited number of invitations'
      ] : [
        'Скидка 150 лари для вас',
        'Скидка 150 лари для вашего друга',
        'Активируется при регистрации друга',
        'Можно сочетать с другими акциями',
        'Неограниченное число приглашений'
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Promotion Title & Subtitle */}
      <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 sm:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl"></div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-1.5 text-xs font-extrabold text-rose-700 border border-rose-100 uppercase tracking-widest">
          <Flame className="h-4 w-4 animate-pulse" />
          {labels.badge}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight font-display leading-none">
          {labels.title}
        </h1>
        <p className="text-sm text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
          {labels.subtitle}
        </p>

        {/* Dynamic Countdown Clock */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 max-w-md mx-auto space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            {labels.urgency}
          </span>
          <div className="grid grid-cols-4 gap-3">
            {[
              { val: timeLeft.days, lbl: labels.days },
              { val: timeLeft.hours, lbl: labels.hours },
              { val: timeLeft.minutes, lbl: labels.minutes },
              { val: timeLeft.seconds, lbl: labels.seconds }
            ].map((unit, i) => (
              <div key={i} className="bg-white border border-slate-200/60 rounded-2xl p-3 text-center shadow-sm">
                <span className="block font-mono text-xl sm:text-2xl font-black text-slate-900 leading-none">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="block text-[9px] font-bold text-slate-400 uppercase mt-1 leading-none">
                  {unit.lbl}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Promotions & Campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer, index) => {
          const IconComponent = offer.icon;
          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all"
            >
              {/* Card top branding header */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`inline-block rounded-full bg-slate-50 border border-slate-200 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-indigo-600`}>
                    {offer.badge}
                  </span>
                  <div className={`h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-tr ${offer.color} text-white shadow`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <h3 className="text-lg font-black text-slate-950 tracking-tight leading-snug">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    {offer.subtitle}
                  </p>
                </div>

                {/* Pricing layout */}
                <div className="pt-2 flex items-baseline gap-2 text-left">
                  {offer.oldPrice && (
                    <span className="text-xs text-slate-400 line-through font-semibold">
                      {offer.oldPrice}
                    </span>
                  )}
                  <span className="text-2xl font-black text-indigo-600 tracking-tight">
                    {offer.price}
                  </span>
                </div>

                {/* Features layout */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-left">
                    {labels.featuresTitle}
                  </h4>
                  <ul className="space-y-2">
                    {offer.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                        <span className="mt-0.5 rounded-full bg-emerald-50 text-emerald-600 p-0.5">
                          <Check className="h-3.5 w-3.5 shrink-0" />
                        </span>
                        <span className="text-left leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom coupon copying box */}
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex justify-between items-center">
                  <div className="text-left">
                    <span className="text-[8px] font-bold text-slate-400 uppercase block leading-none">Promo Code</span>
                    <span className="font-mono text-xs font-extrabold text-slate-800 tracking-wider block mt-1">
                      {offer.code}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(offer.code)}
                    className={`rounded-xl px-3 py-1.5 text-[10px] font-bold border transition-all flex items-center gap-1 ${
                      copiedCode === offer.code
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Copy className="h-3 w-3" />
                    {copiedCode === offer.code ? labels.copied : labels.copyCode}
                  </button>
                </div>

                {/* CTA actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onSelectCoursesTab}
                    className="rounded-2xl bg-indigo-600 text-white text-xs font-bold py-3 hover:bg-indigo-700 transition active:scale-[0.98] text-center"
                  >
                    {labels.enrollBtn}
                  </button>
                  <button
                    onClick={onOpenConsultation}
                    className="rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold py-3 hover:bg-slate-50 transition active:scale-[0.98] text-center"
                  >
                    {labels.getConsult}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trust guarantees badge banner */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
        {[
          { icon: Gift, title: lang === 'ka' ? 'საჩუქრები' : lang === 'en' ? 'Bonus materials' : 'Бонус-материалы', desc: lang === 'ka' ? 'სემინარების ჩანაწერები' : lang === 'en' ? 'Workshop recordings' : 'Записи семинаров' },
          { icon: Calendar, title: lang === 'ka' ? 'მოქნილი სწავლა' : lang === 'en' ? 'Flexible Schedule' : 'Гибкий график', desc: lang === 'ka' ? 'საღამოს საათები' : lang === 'en' ? 'Evening classes' : 'Вечерние занятия' },
          { icon: BookOpen, title: lang === 'ka' ? '0% განვადება' : lang === 'en' ? '0% Financing' : '0% Рассрочка', desc: lang === 'ka' ? 'შიდა განვადება ბანკით' : lang === 'en' ? 'Internal bank installments' : 'Внутреннее финансирование' }
        ].map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <div key={i} className="flex flex-col sm:flex-row items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-indigo-400">
                <ItemIcon className="h-6 w-6" />
              </div>
              <div className="text-center sm:text-left">
                <span className="block text-sm font-black text-white">{item.title}</span>
                <span className="block text-xs text-slate-400 mt-0.5">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
