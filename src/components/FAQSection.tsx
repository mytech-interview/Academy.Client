import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}


export default function FAQSection() {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<string | null>(null);

const faqs: FAQItem[] = Array.from({ length: 7 }, (_, i) => ({
  id: `faq-${i + 1}`,
  question: t(`faq.items.${i}.question`),
  answer: t(`faq.items.${i}.answer`),
}));
const toggleOpen = (id: string) => {
  setOpenId((prev) => (prev === id ? null : id));
};

return (
  <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-600">
          <HelpCircle className="h-4 w-4" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            {t("faq.badge")}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-display">
          {t("faq.title")}
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed max-w-md mx-auto">
          {t("faq.desc")}
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-4 text-left pt-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="bg-white border border-slate-200/80 rounded-[2rem] p-5 shadow-sm hover:border-indigo-150 transition-all cursor-pointer"
              onClick={() => toggleOpen(faq.id)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                  {faq.question}
                </h3>

                <div
                  className={`h-7 w-7 rounded-xl flex items-center justify-center border text-slate-500 bg-slate-50 border-slate-100 transition-transform duration-200 ${
                    isOpen
                      ? "rotate-180 text-indigo-600 bg-indigo-50 border-indigo-100"
                      : ""
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      marginTop: "1rem",
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                    }}
                    className="overflow-hidden border-t border-slate-100/60 pt-4"
                  >
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);}