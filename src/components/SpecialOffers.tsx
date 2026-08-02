import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Check,
  Copy,
  Flame,
  Calendar,
  BookOpen,
  Gift,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface SpecialOffersProps {
  onSelectCoursesTab: () => void;
  onOpenConsultation: () => void;
}

export default function SpecialOffers({
  onSelectCoursesTab,
  onOpenConsultation,
}: SpecialOffersProps) {
  const { t } = useTranslation();
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

const offers = [
  {
    id: "promo-1",
    badge: t("specialOffers.offers.0.badge"),
    title: t("specialOffers.offers.0.title"),
    subtitle: t("specialOffers.offers.0.subtitle"),
    oldPrice: t("specialOffers.offers.0.oldPrice"),
    price: t("specialOffers.offers.0.price"),
    code: t("specialOffers.offers.0.code"),
    icon: Sparkles,
    color: "from-indigo-600 to-violet-600",
    features: t("specialOffers.offers.0.features", {
      returnObjects: true,
    }) as string[],
  },
  {
    id: "promo-2",
    badge: t("specialOffers.offers.1.badge"),
    title: t("specialOffers.offers.1.title"),
    subtitle: t("specialOffers.offers.1.subtitle"),
    oldPrice: t("specialOffers.offers.1.oldPrice"),
    price: t("specialOffers.offers.1.price"),
    code: t("specialOffers.offers.1.code"),
    icon: Flame,
    color: "from-amber-500 to-rose-500",
    features: t("specialOffers.offers.1.features", {
      returnObjects: true,
    }) as string[],
  },
  {
    id: "promo-3",
    badge: t("specialOffers.offers.2.badge"),
    title: t("specialOffers.offers.2.title"),
    subtitle: t("specialOffers.offers.2.subtitle"),
    price: t("specialOffers.offers.2.price"),
    code: t("specialOffers.offers.2.code"),
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    features: t("specialOffers.offers.2.features", {
      returnObjects: true,
    }) as string[],
  },
];

 return (
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
    {/* Promotion Title */}
    <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 sm:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-1.5 text-xs font-extrabold text-rose-700 border border-rose-100 uppercase tracking-widest">
        <Flame className="h-4 w-4 animate-pulse" />
        {t("specialOffers.badge")}
      </span>

      <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight font-display leading-none">
        {t("specialOffers.title")}
      </h1>

      <p className="text-sm text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
        {t("specialOffers.subtitle")}
      </p>

      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 max-w-md mx-auto space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
          {t("specialOffers.urgency")}
        </span>

        <div className="grid grid-cols-4 gap-3">
          {[
            { val: timeLeft.days, lbl: t("specialOffers.days") },
            { val: timeLeft.hours, lbl: t("specialOffers.hours") },
            { val: timeLeft.minutes, lbl: t("specialOffers.minutes") },
            { val: timeLeft.seconds, lbl: t("specialOffers.seconds") },
          ].map((unit, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/60 rounded-2xl p-3 text-center shadow-sm"
            >
              <span className="block font-mono text-xl sm:text-2xl font-black text-slate-900 leading-none">
                {String(unit.val).padStart(2, "0")}
              </span>

              <span className="block text-[9px] font-bold text-slate-400 uppercase mt-1 leading-none">
                {unit.lbl}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Offers */}
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
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="inline-block rounded-full bg-slate-50 border border-slate-200 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-indigo-600">
                  {offer.badge}
                </span>

                <div
                  className={`h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-tr ${offer.color} text-white shadow`}
                >
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

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-left">
                  {t("specialOffers.featuresTitle")}
                </h4>

                <ul className="space-y-2">
                  {offer.features.map((feat, fi) => (
                    <li
                      key={fi}
                      className="flex items-start gap-2.5 text-xs text-slate-600 font-medium"
                    >
                      <span className="mt-0.5 rounded-full bg-emerald-50 text-emerald-600 p-0.5">
                        <Check className="h-3.5 w-3.5 shrink-0" />
                      </span>

                      <span className="text-left leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block leading-none">
                    {t("specialOffers.promoCode")}
                  </span>

                  <span className="font-mono text-xs font-extrabold text-slate-800 tracking-wider block mt-1">
                    {offer.code}
                  </span>
                </div>

                <button
                  onClick={() => copyToClipboard(offer.code)}
                  className={`rounded-xl px-3 py-1.5 text-[10px] font-bold border transition-all flex items-center gap-1 ${
                    copiedCode === offer.code
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Copy className="h-3 w-3" />

                  {copiedCode === offer.code
                    ? t("specialOffers.copied")
                    : t("specialOffers.copyCode")}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onSelectCoursesTab}
                  className="rounded-2xl bg-indigo-600 text-white text-xs font-bold py-3 hover:bg-indigo-700 transition active:scale-[0.98]"
                >
                  {t("specialOffers.enrollBtn")}
                </button>

                <button
                  onClick={onOpenConsultation}
                  className="rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold py-3 hover:bg-slate-50 transition active:scale-[0.98]"
                >
                  {t("specialOffers.getConsult")}
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Footer */}
    <div className="bg-slate-900 text-white rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
      {[
        {
          icon: Gift,
          title: t("specialOffers.footer.0.title"),
          desc: t("specialOffers.footer.0.desc"),
        },
        {
          icon: Calendar,
          title: t("specialOffers.footer.1.title"),
          desc: t("specialOffers.footer.1.desc"),
        },
        {
          icon: BookOpen,
          title: t("specialOffers.footer.2.title"),
          desc: t("specialOffers.footer.2.desc"),
        },
      ].map((item, i) => {
        const ItemIcon = item.icon;

        return (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center gap-3.5"
          >
            <div className="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-indigo-400">
              <ItemIcon className="h-6 w-6" />
            </div>

            <div className="text-center sm:text-left">
              <span className="block text-sm font-black text-white">
                {item.title}
              </span>

              <span className="block text-xs text-slate-400 mt-0.5">
                {item.desc}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
}
