import { Language } from '../types';

const courseTranslations: Record<string, Record<string, any>> = {
  en: {
    'course-1': {
      title: 'Complete Web Development Course (React & Node.js)',
      description: 'Learn modern web development from scratch. The course covers HTML, CSS, JavaScript, React, and Node.js fundamentals.',
      category: 'Programming',
      level: 'Beginner',
      teacherName: 'Mariam Beridze',
      syllabus: [
        'Introduction to the Internet & Web',
        'HTML5 and CSS3 Structure & Styles',
        'Modern JavaScript (ES6+) Fundamentals',
        'React Components and Hooks',
        'Server Building with Node.js & Express',
        'Database Integration & Deployment'
      ],
      lessons: {
        'c1-l1': { title: 'Course Intro & Environment Setup', content: 'In this video we introduce the syllabus, install VS Code and Node.js, and prepare our working environment.' },
        'c1-l2': { title: 'Basic HTML Tags & Structure', content: 'HTML is the skeleton of web pages. Learn tags like p, h1-h6, div, span, img, a, and others.' },
        'c1-l3': { title: 'Quiz: HTML/CSS Fundamentals', content: 'Test your knowledge of HTML tags and structure with a simple 5-question quiz.' },
        'c1-l4': { title: 'CSS3 Styling & Intro to Tailwind CSS', content: 'Learn to apply colors, fonts, sizes, and explore Tailwind CSS utilities for rapid styling.' },
        'c1-l5': { title: 'JavaScript Variables & Functions', content: 'Get to know JS basics: let, const, arrow functions, arrays, and basic loops.' }
      }
    },
    'course-2': {
      title: 'UX/UI Design Fundamentals in Figma',
      description: 'Learn user interface (UI) and user experience (UX) design. Create mobile and web application prototypes in Figma.',
      category: 'Design',
      level: 'Beginner',
      teacherName: 'George Kalandadze',
      syllabus: [
        'What is UX and UI Design?',
        'Figma Interface and Main Tools',
        'User Research, Wireframes & Wireflows',
        'Color Theory, Grids & Typography',
        'Creating Interactive Prototypes',
        'Portfolio Preparation'
      ],
      lessons: {
        'c2-l1': { title: 'Introduction to Digital Design', content: 'We will discuss the difference between UX and UI, looking at examples of good and bad applications.' },
        'c2-l2': { title: 'Figma Workspace & Shapes', content: 'Figma interface overview. Learn to draw objects, use Grouping, and work with Layers.' },
        'c2-l3': { title: 'Color Harmony & Psychology', content: 'How to choose the right color palette for your product and the emotions specific colors evoke in users.' }
      }
    },
    'course-3': {
      title: 'Digital Marketing & SEO Optimization',
      description: 'Make your website visible in Google. Learn Social Media Marketing (SMM), Facebook Ads, and Search Engine Optimization.',
      category: 'Business & Marketing',
      level: 'Intermediate',
      teacherName: 'Nino Shengelia',
      syllabus: [
        'SEO Basics and Keyword Research',
        'On-Page & Off-Page SEO Strategy',
        'SMM: Facebook, Instagram, and LinkedIn campaigns',
        'Google Analytics Setup and Reporting',
        'Email Marketing & Content Strategy'
      ],
      lessons: {
        'c3-l1': { title: 'How Google Search Engine Works', content: 'We will discuss Crawlers, indexation, and algorithms Google uses to distribute sites in search results.' },
        'c3-l2': { title: 'Correct Keyword Selection', content: 'How to use free and paid tools (Google Keyword Planner, Ahrefs, SEMrush) to find appropriate keywords for your business.' }
      }
    },
    'course-4': {
      title: 'Python Fundamentals for Beginners',
      description: 'Introduction to programming using the most popular language. Learn algorithms, structures, and create your first automation script.',
      category: 'Programming',
      level: 'Beginner',
      teacherName: 'Mariam Beridze',
      syllabus: [
        'Installing Python & Running First Code',
        'Data Types and Variables',
        'Conditional Operators (if/else)',
        'Loops (for/while) and Functions',
        'Working with Files & Libraries'
      ],
      lessons: {
        'c4-l1': { title: 'Hello World and Data Types in Python', content: 'Intro to Python. Learn the print function and basic types: Integer, String, Float, Boolean.' },
        'c4-l2': { title: 'Quiz: Python Data Types', content: 'A simple quiz to test your type conversion and basic mathematical operations in Python.' }
      }
    }
  },
  ru: {
    'course-1': {
      title: 'Полный курс веб-разработки (React & Node.js)',
      description: 'Изучите современную веб-разработку с нуля. Курс охватывает HTML, CSS, JavaScript, React и основы Node.js.',
      category: 'Программирование',
      level: 'Начальный',
      teacherName: 'Мариам Беридзе',
      syllabus: [
        'Введение в Интернет и Веб',
        'Структура и стили HTML5 и CSS3',
        'Основы современного JavaScript (ES6+)',
        'Компоненты React и хуки',
        'Создание сервера с Node.js и Express',
        'Интеграция баз данных и деплой проекта'
      ],
      lessons: {
        'c1-l1': { title: 'Введение в курс и подготовка среды', content: 'В этом видео мы представим программу курса, установим VS Code, Node.js и подготовим все инструменты.' },
        'c1-l2': { title: 'Основные теги и структура HTML', content: 'HTML — это скелет веб-страницы. Изучим p, h1-h6, div, span, img, a и другие базовые элементы.' },
        'c1-l3': { title: 'Тест: Основы HTML/CSS', content: 'Проверьте свои знания тегов и структуры HTML с помощью простого теста из 5 вопросов.' },
        'c1-l4': { title: 'Стили CSS3 и введение в Tailwind CSS', content: 'В этом уроке научимся задавать цвета, шрифты, размеры и познакомимся с Tailwind CSS для быстрой стилизации.' },
        'c1-l5': { title: 'Переменные и функции в JavaScript', content: 'Познакомьтесь с основами JS: let, const, стрелочные функции, массивы и простые циклы.' }
      }
    },
    'course-2': {
      title: 'Основы UX/UI дизайна в Figma',
      description: 'Изучите дизайн пользовательского интерфейса (UI) и опыта (UX). Создавайте прототипы мобильных и веб-приложений в Figma.',
      category: 'Дизайн',
      level: 'Начальный',
      teacherName: 'Георгий Каландадзе',
      syllabus: [
        'Что такое UX и UI дизайн?',
        'Интерфейс Figma и основные инструменты',
        'Исследование пользователей, варфреймы и варфлоу',
        'Теория цвета, сетки и типографика',
        'Создание интерактивных прототипов',
        'Подготовка портфолио'
      ],
      lessons: {
        'c2-l1': { title: 'Введение в цифровой дизайн', content: 'Мы разберем разницу между UX и UI, изучим примеры хороших и плохих приложений.' },
        'c2-l2': { title: 'Рабочее пространство Figma и фигуры', content: 'Обзор интерфейса Figma. Научимся рисовать объекты, использовать группировку и слои.' },
        'c2-l3': { title: 'Гармония цвета и психология', content: 'Как правильно подобрать цветовую палитру для продукта и какие эмоции цвета вызывает у пользователей.' }
      }
    },
    'course-3': {
      title: 'Цифровой маркетинг и SEO-оптимизация',
      description: 'Сделайте ваш сайт заметным в Google. Изучите SMM, Facebook Ads и поисковую оптимизацию.',
      category: 'Бизнес и маркетинг',
      level: 'Средний',
      teacherName: 'Нино Шенгелия',
      syllabus: [
        'Основы SEO и исследование ключевых слов',
        'Стратегия On-Page и Off-Page SEO',
        'SMM: кампании в Facebook, Instagram и LinkedIn',
        'Настройка Google Analytics и отчетность',
        'Email-маркетинг и контент-стратегия'
      ],
      lessons: {
        'c3-l1': { title: 'Как работает поисковая система Google?', content: 'Мы обсудим краулеры, индексацию и алгоритмы, с помощью которых Google ранжирует сайты.' },
        'c3-l2': { title: 'Правильный выбор ключевых слов', content: 'Как использовать бесплатные и платные инструменты для поиска подходящих ключевых слов.' }
      }
    },
    'course-4': {
      title: 'Основы Python для начинающих',
      description: 'Введение в программирование на самом популярном языке. Изучите алгоритмы, структуры и создайте первый скрипт автоматизации.',
      category: 'Программирование',
      level: 'Начальный',
      teacherName: 'Мариам Беридзе',
      syllabus: [
        'Установка Python и запуск первого кода',
        'Типы данных и переменные',
        'Условные операторы (if/else)',
        'Циклы (for/while) и функции',
        'Работа с файлами и библиотеками'
      ],
      lessons: {
        'c4-l1': { title: 'Hello World и типы данных в Python', content: 'Введение в Python. Изучим функцию print и основные типы: Integer, String, Float, Boolean.' },
        'c4-l2': { title: 'Тест: Типы данных Python', content: 'Простой тест для проверки конвертации типов и математических операций в Python.' }
      }
    }
  }
};

export function getTranslatedCourse(course: any, lang: Language): any {
  if (lang === 'ka') return course;
  const langMap = courseTranslations[lang];
  if (!langMap || !langMap[course.id]) {
    return {
      ...course,
      category: translateCategory(course.category, lang),
      level: translateLevel(course.level, lang),
    };
  }

  const tInfo = langMap[course.id];
  return {
    ...course,
    title: tInfo.title,
    description: tInfo.description,
    category: tInfo.category,
    level: tInfo.level,
    teacherName: tInfo.teacherName || course.teacherName,
    syllabus: tInfo.syllabus,
    lessons: course.lessons.map((lesson: any) => {
      const translatedLesson = tInfo.lessons?.[lesson.id];
      if (translatedLesson) {
        return {
          ...lesson,
          title: translatedLesson.title,
          content: translatedLesson.content,
        };
      }
      return lesson;
    }),
  };
}

export function translateCategory(cat: string, lang: Language): string {
  if (lang === 'ka') return cat;
  const categoriesMap: Record<string, Record<Language, string>> = {
    'ყველა': { ka: 'ყველა', en: 'All', ru: 'Все' },
    'პროგრამირება': { ka: 'პროგრამირება', en: 'Programming', ru: 'Программирование' },
    'დიზაინი': { ka: 'დიზაინი', en: 'Design', ru: 'Дизайн' },
    'ბიზნესი და მარკეტინგი': { ka: 'ბიზნესი და მარკეტინგი', en: 'Business & Marketing', ru: 'Бизнес и маркетинг' }
  };
  return categoriesMap[cat]?.[lang] || cat;
}

export function translateLevel(lvl: string, lang: Language): string {
  if (lang === 'ka') return lvl;
  const levelsMap: Record<string, Record<Language, string>> = {
    'დამწყები': { ka: 'დამწყები', en: 'Beginner', ru: 'Начальный' },
    'საშუალო': { ka: 'საშუალო', en: 'Intermediate', ru: 'Средний' },
    'პროფესიონალი': { ka: 'პროფესიონალი', en: 'Advanced', ru: 'Продвинутый' }
  };
  return levelsMap[lvl]?.[lang] || lvl;
}

export function getTranslatedCategories(categories: string[], lang: Language): string[] {
  return categories.map((cat) => translateCategory(cat, lang));
}
