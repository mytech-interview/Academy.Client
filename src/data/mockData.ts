import { Course, User } from '../types';

export const mockTeachers: User[] = [
  {
    id: 'teacher-1',
    email: 'm.beridze@academy.ge',
    name: 'მარიამ ბერიძე',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    headline: 'Senior Full-Stack დეველოპმენტი',
    bio: '10-წლიანი გამოცდილება ვებ-დეველოპმენტში. მუშაობდა წამყვან საერთაშორისო კომპანიებში React და Node.js ტექნოლოგიებით.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'teacher-2',
    email: 'g.kalandadze@academy.ge',
    name: 'გიორგი კალანდაძე',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    headline: 'UX/UI & პროდუქტის დიზაინერი',
    bio: 'პროდუქტის წამყვანი დიზაინერი. ეხმარება სტუდენტებს პრაქტიკული და თანამედროვე ციფრული ინტერფეისების შექმნაში.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'teacher-3',
    email: 'n.shengelia@academy.ge',
    name: 'ნინო შენგელია',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    headline: 'ციფრული მარკეტინგის ექსპერტი',
    bio: 'სერტიფიცირებული SEO და Google Ads სპეციალისტი. აქვს 50-ზე მეტი წარმატებული კამპანია ქართულ და უცხოურ ბაზარზე.',
    createdAt: new Date().toISOString()
  }
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'ვებ დეველოპმენტის სრული კურსი (React & Node.js)',
    description: 'შეისწავლეთ თანამედროვე ვებ დეველოპმენტი ნულიდან. კურსი მოიცავს HTML, CSS, JavaScript, React-ს და Node.js-ის საფუძვლებს.',
    category: 'პროგრამირება',
    level: 'დამწყები',
    duration: '32 საათი',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    teacherId: 'teacher-1',
    teacherName: 'მარიამ ბერიძე',
    enrolledCount: 142,
    rating: 4.8,
    price: 'უფასო',
    syllabus: [
      'შესავალი ინტერნეტსა და ვებში',
      'HTML5 და CSS3 სტრუქტურა და სტილები',
      'თანამედროვე JavaScript-ის (ES6+) საფუძვლები',
      'React კომპონენტები და Hooks',
      'Node.js & Express-ით სერვერის აწყობა',
      'მონაცემთა ბაზების ინტეგრაცია და პროექტის განთავსება'
    ],
    lessons: [
      {
        id: 'c1-l1',
        title: 'კურსის შესავალი და გარემოს მომზადება',
        duration: '10 წთ',
        type: 'video',
        content: 'ამ ვიდეოში გაგაცნობთ კურსის სილაბუსს, დავაინსტალირებთ VS Code-ს, Node.js-ს და მოვამზადებთ მუშაობისთვის საჭირო ყველა ხელსაწყოს.'
      },
      {
        id: 'c1-l2',
        title: 'HTML-ის ძირითადი თეგები და სტრუქტურა',
        duration: '15 წთ',
        type: 'article',
        content: 'HTML (HyperText Markup Language) არის ვებ გვერდის ჩონჩხი. ვისწავლით p, h1-h6, div, span, img, a და სხვა ძირითად ელემენტებს.'
      },
      {
        id: 'c1-l3',
        title: 'ტესტი: HTML/CSS საფუძვლები',
        duration: '8 წთ',
        type: 'quiz',
        content: 'შეამოწმეთ თქვენი ცოდნა HTML-ის თეგებისა და სტრუქტურის შესახებ მარტივი 5-კითხვიანი ტესტით.'
      },
      {
        id: 'c1-l4',
        title: 'CSS3-ის სტილები და Tailwind CSS-ის შესავალი',
        duration: '22 წთ',
        type: 'video',
        content: 'ამ გაკვეთილში შევისწავლით ფერების, ფონტების, ზომების მინიჭებას და გავეცნობით Tailwind CSS-ის უტილიტებს სწრაფი სტილიზაციისთვის.'
      },
      {
        id: 'c1-l5',
        title: 'JavaScript-ის ცვლადები და ფუნქციები',
        duration: '25 წთ',
        type: 'video',
        content: 'გავეცნობით JS-ის საფუძვლებს: let, const, arrow functions, მასივებსა და მარტივ ციკლებს.'
      }
    ]
  },
  {
    id: 'course-2',
    title: 'UX/UI დიზაინის საფუძვლები Figma-ში',
    description: 'ისწავლეთ მომხმარებლის ინტერფეისის (UI) და გამოცდილების (UX) დიზაინი. შექმენით მობილური და ვებ აპლიკაციების პროტოტიპები Figma-ში.',
    category: 'დიზაინი',
    level: 'დამწყები',
    duration: '24 საათი',
    image: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=800',
    teacherId: 'teacher-2',
    teacherName: 'გიორგი კალანდაძე',
    enrolledCount: 98,
    rating: 4.9,
    price: '79 ₾',
    syllabus: [
      'რა არის UX და UI დიზაინი?',
      'Figma-ს ინტერფეისი და ძირითადი ხელსაწყოები',
      'მომხმარებლის კვლევა, Wireframes და Wireflows',
      'ფერების თეორია, გრიდები და ტიპოგრაფია',
      'ინტერაქტიული პროტოტიპების შექმნა',
      'პორტფოლიოს მომზადება'
    ],
    lessons: [
      {
        id: 'c2-l1',
        title: 'შესავალი ციფრულ დიზაინში',
        duration: '12 წთ',
        type: 'video',
        content: 'განვიხილავთ განსხვავებას UX-სა და UI-ს შორის, გავეცნობით კარგად და ცუდად შექმნილ აპლიკაციებს.'
      },
      {
        id: 'c2-l2',
        title: 'Figma-ს სამუშაო სივრცე და Shape-ები',
        duration: '18 წთ',
        type: 'video',
        content: 'Figma-ს ინტერფეისის მიმოხილვა. ვისწავლით ობიექტების ხატვას, დაჯგუფებას (Grouping) და ფენებთან (Layers) მუშაობას.'
      },
      {
        id: 'c2-l3',
        title: 'ფერების ჰარმონია და ფსიქოლოგია',
        duration: '15 წთ',
        type: 'article',
        content: 'როგორ შევარჩიოთ სწორი ფერთა პალიტრა ჩვენი პროდუქტისთვის და რა ემოციებს იწვევს კონკრეტული ფერები მომხმარებლებში.'
      }
    ]
  },
  {
    id: 'course-3',
    title: 'ციფრული მარკეტინგი და SEO ოპტიმიზაცია',
    description: 'გახადეთ თქვენი ვებსაიტი ხილვადი Google-ში. შეისწავლეთ სოციალური მედიის მარკეტინგი (SMM), Facebook Ads და საძიებო სისტემების ოპტიმიზაცია.',
    category: 'ბიზნესი და მარკეტინგი',
    level: 'საშუალო',
    duration: '20 საათი',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    teacherId: 'teacher-3',
    teacherName: 'ნინო შენგელია',
    enrolledCount: 76,
    rating: 4.7,
    price: '59 ₾',
    syllabus: [
      'SEO-ს საფუძვლები და ქივორდების კვლევა',
      'On-Page და Off-Page SEO სტრატეგია',
      'SMM: Facebook, Instagram და LinkedIn კამპანიები',
      'Google Analytics-ის გამართვა და რეპორტინგი',
      'Email მარკეტინგი და კონტენტ სტრატეგია'
    ],
    lessons: [
      {
        id: 'c3-l1',
        title: 'როგორ მუშაობს საძიებო სისტემა Google?',
        duration: '14 წთ',
        type: 'video',
        content: 'ვისაუბრებთ ქროულერებზე (Crawlers), ინდექსაციასა და იმ ალგორითმებზე, რომლებითაც Google ანაწილებს საიტებს ძიების შედეგებში.'
      },
      {
        id: 'c3-l2',
        title: 'საკვანძო სიტყვების (Keywords) სწორი შერჩევა',
        duration: '20 წთ',
        type: 'article',
        content: 'როგორ გამოვიყენოთ უფასო და ფასიანი ხელსაწყოები (Google Keyword Planner, Ahrefs, SEMrush) თქვენი ბიზნესისთვის შესაფერისი სიტყვების საპოვნელად.'
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Python-ის საფუძვლები დამწყებთათვის',
    description: 'პროგრამირების შესავალი ყველაზე პოპულარული ენის გამოყენებით. ისწავლეთ ალგორითმები, სტრუქტურები და შექმენით თქვენი პირველი ავტომატიზაციის სკრიპტი.',
    category: 'პროგრამირება',
    level: 'დამწყები',
    duration: '28 საათი',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    teacherId: 'teacher-1',
    teacherName: 'მარიამ ბერიძე',
    enrolledCount: 115,
    rating: 4.8,
    price: 'უფასო',
    syllabus: [
      'Python-ის დაყენება და პირველი კოდის გაშვება',
      'მონაცემთა ტიპები და ცვლადები',
      'პირობითი ოპერატორები (if/else)',
      'ციკლები (for/while) და ფუნქციები',
      'მუშაობა ფაილებთან და ბიბლიოთეკებთან'
    ],
    lessons: [
      {
        id: 'c4-l1',
        title: 'Hello World და მონაცემთა ტიპები Python-ში',
        duration: '15 წთ',
        type: 'video',
        content: 'შესავალი Python-ში. ვისწავლით პრინტ ფუნქციას და გავეცნობით ძირითად ტიპებს: Integer, String, Float, Boolean.'
      },
      {
        id: 'c4-l2',
        title: 'ტესტი: Python მონაცემთა ტიპები',
        duration: '5 წთ',
        type: 'quiz',
        content: 'მარტივი ქვიზი Python-ში ტიპების კონვერტაციისა და მათემატიკური ოპერაციების შესამოწმებლად.'
      }
    ]
  }
];

export const mockCategories = [
  'ყველა',
  'პროგრამირება',
  'დიზაინი',
  'ბიზნესი და მარკეტინგი'
];
