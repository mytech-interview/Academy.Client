import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { Language } from '../lib/translations';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  lang: Language;
}

export default function FAQSection({ lang }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const t = {
    ka: {
      badge: 'ხშირად დასმული შეკითხვები',
      title: 'პასუხები თქვენს კითხვებზე',
      desc: 'გაეცანით პასუხებს იმ კითხვებზე, რომლებიც ყველაზე ხშირად უჩნდებათ ჩვენს მომავალ სტუდენტებს.'
    },
    en: {
      badge: 'Frequently Asked Questions',
      title: 'Answers to Your Questions',
      desc: 'Explore answers to the questions most commonly asked by our prospective students.'
    },
    ru: {
      badge: 'Часто задаваемые вопросы',
      title: 'Ответы на ваши вопросы',
      desc: 'Ознакомьтесь с ответами на вопросы, которые чаще всего возникают у будущих студентов.'
    }
  }[lang] || {
    badge: 'ხშირად დასმული შეკითხვები',
    title: 'პასუხები თქვენს კითხვებზე',
    desc: 'გაეცანით პასუხებს იმ კითხვებზე, რომლებიც ყველაზე ხშირად უჩნდებათ ჩვენს მომავალ სტუდენტებს.'
  };

  const rawFaqs = [
    {
      id: 'faq-1',
      question: {
        ka: 'რა სახის მოწმობას გასცემთ სწავლის დასრულებისას - დიპლომს თუ სერტიფიკატს? აკრედიტებულია თუ არა?',
        en: 'What kind of credential is issued upon graduation – a diploma or a certificate? Is it accredited?',
        ru: 'Какой документ выдается по окончании обучения – диплом или сертификат? Аккредитована ли программа?'
      },
      answer: {
        ka: 'კურსის წარმატებით დასრულების შემთხვევაში, კურსდამთავებულს გადაეცემა IT აკადემიის საერთაშორისო დიპლომი, ასევე ჩვენს ხელთ არსებულ სერტიფიკატების მფლობელობა. ვთავაზობთ გაზარდონ თავიანთი საერთაშორისო სერტიფიკატების მფლობელობა, ასევე ჩვენი პროგრამა არის აღიარებული მსოფლიოს წამყვანი ტექ-გიგანტების მიერ.',
        en: 'Upon successful completion of the course, graduates receive an international diploma from the IT Academy. We also help students prepare for and obtain industry-standard vendor certifications recognized by leading tech giants worldwide.',
        ru: 'При успешном завершении курса выпускники получают международный диплом IT-академии. Мы также помогаем студентам подготовиться к сдаче индустриальных вендорских сертификаций, признанных ведущими мировыми технологическими гигантами.'
      }
    },
    {
      id: 'faq-2',
      question: {
        ka: 'სწავლის პერიოდში და დასრულების შემდეგ თუ შევძლებ დასაქმებას და თქვენ თუ უწყობთ ხელს დასაქმებაში?',
        en: 'Can I find a job during or after my studies, and do you assist with job placement?',
        ru: 'Смогу ли я найти работу во время или после учебы, и помогаете ли вы с трудоустройством?'
      },
      answer: {
        ka: 'დიახ, ჩვენი ერთ-ერთი მთავარი მიზანია სტუდენტების დასაქმება. აკადემიას აქვს მჭიდრო კავშირი წამყვან ქართულ და საერთაშორისო ტექ-კომპანიებთან. სწავლის დასრულების შემდეგ საუკეთესო კურსდამთავრებულები ავტომატურად იღებენ მიწვევებს გასაუბრებაზე, ხოლო კარიერული განვითარების ცენტრი გეხმარებათ CV-ის მომზადებასა და პორტფოლიოს შედგენაში.',
        en: 'Yes, our primary goal is student employment. The academy maintains close ties with leading local and international tech firms. Top graduates automatically receive interview invitations, and our Career Center assists with CV design and portfolio building.',
        ru: 'Да, наша главная цель – трудоустройство студентов. Академия тесно сотрудничает с ведущими местными и международными ИТ-компаниями. Лучшие выпускники автоматически получают приглашения на собеседования, а наш карьерный центр помогает составить резюме и портфолио.'
      }
    },
    {
      id: 'faq-3',
      question: {
        ka: 'რა საბაზისო უნარებს უნდა ფლობდეს პოტენციური სტუდენტი რომ დაიწყოს სწავლა?',
        en: 'What basic skills should a prospective student have to start learning?',
        ru: 'Какими базовыми навыками должен обладать потенциальный студент для начала обучения?'
      },
      answer: {
        ka: 'უმეტესობა ჩვენი სასწავლო პროგრამა შექმნილია სრული დამწყებებისთვის, შესაბამისად წინასწარი ტექნიკური ცოდნა არ არის საჭირო. მთავარია საბაზისო კომპიუტერული უნარების ქონა (ფაილებთან მუშაობა, ინტერნეტის გამოყენება) და, რაც ყველაზე მნიშვნელოვანია, სწავლისა და განვითარების მაღალი მოტივაცია.',
        en: 'Most of our courses are designed from scratch for complete beginners; no prior technical background is needed. Basic computer literacy (managing files, web navigation) and strong motivation are all that is required.',
        ru: 'Большинство наших программ разработаны с нуля для начинающих, поэтому предварительные технические знания не требуются. Важна лишь базовая компьютерная грамотность и сильная мотивация.'
      }
    },
    {
      id: 'faq-4',
      question: {
        ka: 'შემიძლია თუ არა აკადემიაში სტუმრობა?',
        en: 'Can I visit the academy campus?',
        ru: 'Могу ли я посетить академию лично?'
      },
      answer: {
        ka: 'რა თქმა უნდა! ჩვენ ყოველთვის მოხარულები ვართ ვუმასპინძლოთ დაინტერესებულ პირებს. შეგიძლიათ წინასწარ დაჯავშნოთ უფასო კონსულტაცია ან უბრალოდ გვესტუმროთ სამუშაო საათებში, დაათვალიეროთ ჩვენი მყუდრო ლაბორატორიები და გაესაუბროთ კოორდინატორებს.',
        en: 'Of course! We are always happy to host visitors. You can schedule a free consultation beforehand or simply stop by during working hours to tour our labs and talk to program coordinators.',
        ru: 'Конечно! Мы всегда рады гостям. Вы можете заранее записаться на бесплатную консультацию или просто зайти в рабочие часы, посмотреть аудитории и пообщаться с координаторами.'
      }
    },
    {
      id: 'faq-5',
      question: {
        ka: 'რა კვალიფიკაცია და სამუშაო გამოცდილება აქვთ ლექტორებს?',
        en: 'What qualifications and experience do the instructors have?',
        ru: 'Какая квалификация и опыт работы у преподавателей?'
      },
      answer: {
        ka: 'ჩვენი ყველა ლექტორი არის მოქმედი, პრაქტიკოსი სპეციალისტი წამყვან ტექნოლოგიურ კომპანიებში (როგორებიცაა Leavingstone, EPAM, და სხვ.). მათ აქვთ მინიმუმ 5+ წლიანი რეალური მუშაობის გამოცდილება და გავლილი აქვთ სპეციალური პედაგოგიური ტრენინგი სწავლების თანამედროვე მეთოდოლოგიებში.',
        en: 'All our instructors are active, practicing professionals in leading technology companies (Leavingstone, EPAM, etc.). They have at least 5+ years of real-world experience and have completed dedicated pedagogical training.',
        ru: 'Все наши преподаватели – действующие практики из ведущих технологических компаний (Leavingstone, EPAM и др.). У них за плечами более 5 лет реального опыта разработки и специальная методическая подготовка.'
      }
    },
    {
      id: 'faq-6',
      question: {
        ka: 'შესაძლებელია თუ არა ლექციების განრიგის შეცვლა?',
        en: 'Is it possible to change the lecture schedule?',
        ru: 'Можно ли изменить расписание занятий?'
      },
      answer: {
        ka: 'ლექციების განრიგი წინასწარ არის გაწერილი ჯგუფების მიხედვით. თუმცა, თუ თქვენი სამუშაო ან სასწავლო გრაფიკი შეიცვალა, ჩვენი ადმინისტრაცია მაქსიმალურად შეეცდება შემოგთავაზოთ ალტერნატიული ჯგუფი შესაფერისი საათებით.',
        en: 'The lecture schedules are fixed per group. However, if your work or academic schedule changes, our administration will do its best to find and offer you an alternative group with suitable hours.',
        ru: 'Расписание лекций составляется заранее по группам. Однако, если ваш рабочий или учебный график изменился, администрация постарается предложить альтернативную группу с подходящим временем.'
      }
    },
    {
      id: 'faq-7',
      question: {
        ka: 'შესაძლებელია თუ არა ონლაინ სწავლა?',
        en: 'Is online learning available?',
        ru: 'Возможно ли обучение онлайн?'
      },
      answer: {
        ka: 'დიახ, ჩვენ გვაქვს სწავლების ჰიბრიდული და სრულად ონლაინ ფორმატიც. ონლაინ ლექციები მიმდინარეობს რეალურ დროში (ლაივ რეჟიმში), სადაც შეგიძლიათ პირდაპირ დაუსვათ კითხვები ლექტორს და მიიღოთ მონაწილეობა დისკუსიებში. ყველა ლექციის ჩანაწერი ინახება სტუდენტის კაბინეტში.',
        en: 'Yes, we offer hybrid and fully online learning formats. Online classes take place in real-time (live stream), allowing you to ask questions directly and join discussions. All recorded sessions are saved in your student cabinet.',
        ru: 'Да, у нас есть гибридный и полностью онлайн-форматы. Онлайн-занятия проходят в реальном времени (live), где можно задавать вопросы преподавателю. Записи лекций сохраняются в личном кабинете студента.'
      }
    }
  ];

  const faqs: FAQItem[] = rawFaqs.map((f) => ({
    id: f.id,
    question: f.question[lang] || f.question.ka,
    answer: f.answer[lang] || f.answer.ka
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
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{t.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-display">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed max-w-md mx-auto">
            {t.desc}
          </p>
        </div>

        {/* FAQs list */}
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
                      isOpen ? 'rotate-180 text-indigo-600 bg-indigo-50 border-indigo-100' : ''
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
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
  );
}
