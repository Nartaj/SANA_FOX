import React, { useState } from 'react';
import { useNavigation } from '../navigation/NavigationState';
import { BookOpen, ChevronRight, ChevronLeft, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { repository } from '../data/repository';
import { AchievementService } from '../services/AchievementService';
import { AchievementCriteria, User } from '../types/models';
import phishingImg from '../assets/icons/Phishing-icon.png';
import virusesImg from '../assets/icons/Viruses-icon.png';
import habitsImg from '../assets/icons/Basic-habits-icon.png';
import background from '../assets/icons/Background.jpg';

// Структура данных: внутри каждого урока массив коротких страниц (pages) вместо одного текста
// Ключевые термины выделены звездочками *текст* для автоматической подсветки
const LESSONS_DATA: Record<string, { id: string; title: string; pages: string[] }[]> = {
  m1: [
    {
      id: '1',
      title: 'Что такое фишинг?',
      pages: [
        'Фишинг — это крайне опасный вид *интернет-мошенничества*. Его главная цель — выманить у тебя секретную информацию.',
        'Злоумышленники охотятся за твоими *паролями*, *номерами банковских карт* и личными доступами к аккаунтам.',
        'Они мастерски маскируются под *известные бренды*, популярные банки или государственные сервисы, чтобы усыпить твою бдительность.'
      ]
    },
    {
      id: '2',
      title: 'Как распознать фейк',
      pages: [
        'Первым делом всегда внимательно проверяй *реальный адрес отправителя*. Мошенники рассчитывают на твою невнимательность.',
        'Они часто меняют всего одну незаметную букву в названии сайта. Например, вместо *@netflix.com* они могут прислать письмо с домена *@netfl1x-security.com*.',
        'Также фейковые сообщения легко узнать по кричащим заголовкам, куче ошибок и паническим требованиям в духе: *«Срочно! Ваш счет будет заблокирован через 2 часа!»*'
      ]
    },
    {
      id: '3',
      title: 'Ссылки и вложения',
      pages: [
        'Главное правило: никогда не кликай по ссылкам из подозрительных писем и СМС. Они ведут на *фишинговые сайты-двойники*.',
        'Особенно опасно скачивать неизвестные файлы. Под видом безобидного «счета на оплату» или «акта» часто прячутся вредоносные скрипты с расширениями *.exe, .bat или .scr*.'
      ]
    },
    {
      id: '4',
      title: 'Смишинг и Вишинг',
      pages: [
        'Фишинг бывает разным. *Смишинг* — это текстовые атаки через СМС или мессенджеры со ссылками на поддельные розыгрыши или фейковую доставку посылок.',
        '*Вишинг* — это мошенничество по телефону. Злоумышленники используют подмену номеров и голоса, представляясь *«службой безопасности банка»* или сотрудниками полиции.'
      ]
    },
    {
      id: '5',
      title: 'Правила защиты',
      pages: [
        'Запомни: ни один банк или легитимный сервис *никогда не потребует* твой пароль, PIN-код или полный номер карты в переписке или по телефону.',
        'Если у тебя возникли малейшие сомнения — сразу же закрывай сообщение, открывай официальный сайт сервиса вручную в браузере и проверяй информацию в *поддержке*.'
      ]
    }
  ],
  m2: [
    {
      id: '1',
      title: 'Вредоносное ПО',
      pages: [
        '*Вредоносное ПО (Malware)* — это общее название для любых программ, созданных хакерами для кражи данных или нанесения вреда.',
        'Такие программы могут тайно работать в фоновом режиме, воровать твои *пароли*, следить за экраном и превращать устройство в инструмент для кибератак.'
      ]
    },
    {
      id: '2',
      title: 'Вирусы и Трояны',
      pages: [
        'Классические *компьютерные вирусы* способны заражать чистые файлы операционной системы и самостоятельно размножаться, ломая программы.',
        '*Трояны* действуют хитрее: они маскируются под полезный софт (например, бесплатную игру или читы), но запускают опасный код сразу после установки.'
      ]
    },
    {
      id: '3',
      title: 'Шифровальщики',
      pages: [
        '*Вирусы-вымогатели (Ransomware)* — одна из самых жестких угроз. Попадая на устройство, они мгновенно шифруют все твои личные фото и документы.',
        'После этого хакеры выводят на экран окно с требованием *заплатить крупный выкуп* в криптовалюте за ключ для расшифровки файлов.'
      ]
    },
    {
      id: '4',
      title: 'Работа антивируса',
      pages: [
        'Современный *антивирус* защищает систему двумя путями: он сверяет файлы с базой уже известных угроз (*сигнатурный анализ*).',
        'А также непрерывно следит за поведением запущенных программ. Если калькулятор вдруг пытается изменить системные файлы, антивирус заблокирует его благодаря *эвристическому анализу*.'
      ]
    },
    {
      id: '5',
      title: 'Гигиена загрузок',
      pages: [
        'Чтобы обезопасить себя, скачивай приложения исключительно из официальных магазинов: *App Store* или *Google Play*.',
        'Обходи стороной пиратские торренты, неофициальные моды для приложений и программы для взлома — в них практически всегда вшит *опасный троян*.'
      ]
    }
  ],
  m3: [
    {
      id: '1',
      title: 'Сложные пароли',
      pages: [
        'Забудь про комбинации вроде *«123456»* или *«qwerty»*. Хакеры взламывают такие простые пароли за считанные секунды методом автоматического подбора.',
        'Надежный пароль должен содержать от *12-16 символов*, включать большие и маленькие буквы, цифры и спецсимволы (например, *@, #, $*, %).',
        'Самое главное: *никогда не используй* один и тот же пароль на разных сайтах. Если взломают один сервис — хакеры получат доступ сразу ко всем твоим аккаунтам.'
      ]
    },
    {
      id: '2',
      title: 'Что такое 2FA?',
      pages: [
        '*Двухфакторная аутентификация (2FA)* — это самый надежный щит для твоих профилей. Она требует два разных подтверждения при входе.',
        'Даже если злоумышленники узнают твой пароль, они не войдут в аккаунт без *одноразового кода*, который приходит в СМС или специальное приложение (*Google Authenticator*).'
      ]
    },
    {
      id: '3',
      title: 'Обновления ПО',
      pages: [
        'Обновления операционной системы и приложений — это не просто новые функции, а в первую очередь *исправление критических уязвимостей*.',
        'Хакеры постоянно ищут «дыры» в старых версиях программ. Регулярная установка обновлений закрывает эти бреши и лишает взломщиков шансов на успех.'
      ]
    },
    {
      id: '4',
      title: 'Опасный публичный Wi-Fi',
      pages: [
        'Открытые Wi-Fi сети в кафе, торговых центрах или аэропортах *не зашифрованы*. Любой человек в этой же сети может перехватить твой трафик.',
        'Если тебе срочно нужно зайти в банк или на важный сайт через публичный Wi-Fi, обязательно включай надежный *VPN* для шифрования данных.'
      ]
    },
    {
      id: '5',
      title: 'Зачем нужны бэкапы?',
      pages: [
        '*Резервное копирование (Бэкап)* — это твоя страховка на случай поломки телефона, кражи устройства или заражения вирусом-вымогателем.',
        'Настрой регулярное автоматическое сохранение всех важных контактов, документов и фотографий в защищенное *облачное хранилище*.'
      ]
    }
  ]
};

// Функция-парсер, которая находит слова между звездочками *...* и подсвечивает их фиолетово-розовым цветом
const formatHighlightedText = (text: string) => {
  const parts = text.split(/\*(.*?)\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <span key={index} className="text-[#D8B4FE] font-bold">
          {part}
        </span>
      );
    }
    return part;
  });
};

export const LessonsHome: React.FC = () => {
  const { push } = useNavigation();

  const modules = [
    {
      id: 'm1',
      title: 'Phishing',
      subtitle: 'Learn how to spot fake messages.',
      image: phishingImg,
      tag: 'New Lesson',
      theme: 'light'
    },
    {
      id: 'm2',
      title: 'Viruses',
      subtitle: 'Understand how bad software can harm devices.',
      image: virusesImg,
      tag: 'Level 2',
      theme: 'dark'
    },
    {
      id: 'm3',
      title: 'Basic Habits',
      subtitle: 'Simple rules to stay safe every day.',
      image: habitsImg,
      tag: 'Daily',
      theme: 'dark'
    }
  ];

  return (
    <div className="flex flex-col p-6 gap-6 min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      />

      <header className="mt-8 mb-4 relative z-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">
          Hello! Ready to stay safe online?
        </h1>
        <p className="text-lg text-white/80 font-medium">
          Let's learn how to protect yourself.
        </p>
      </header>

      <div className="flex flex-col gap-5 relative z-10">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => push('ModuleDetails', { id: module.id, title: module.title })}
            className={`rounded-[32px] p-6 h-44 flex flex-col justify-between relative overflow-hidden shadow-xl text-left transition-transform active:scale-[0.98] ${
              module.theme === 'light'
                ? 'bg-white text-[#141414]'
                : 'bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 text-white'
            }`}
          >
            <div className="flex flex-col gap-1 relative z-10">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full w-fit uppercase tracking-wider ${
                module.theme === 'light' ? 'bg-[#FF6A00] text-white' : 'bg-[#FF6A00]/20 text-[#FF6A00]'
              }`}>
                {module.tag}
              </span>
              <h2 className="text-3xl font-bold mt-2">{module.title}</h2>
              <p className={`text-sm font-medium max-w-[55%] ${
                module.theme === 'light' ? 'text-[#141414]/70' : 'text-white/60'
              }`}>
                {module.subtitle}
              </p>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-36 h-36 flex items-center justify-center pointer-events-none">
              <img
                src={module.image}
                alt={`${module.title} icon`}
                width="144"
                height="144"
                className="w-full h-full object-contain block"
                referrerPolicy="no-referrer"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const ModuleDetails: React.FC<{ params?: any }> = ({ params }) => {
  const { pop, push } = useNavigation();
  
  const moduleId = params?.id || 'm1';
  const lessons = LESSONS_DATA[moduleId] || [];

  return (
    <div className="flex flex-col p-6 gap-6">
      <button onClick={pop} className="mt-8 flex items-center gap-2 text-[#FF6A00] font-bold">
        <ArrowLeft size={20} />
        Back
      </button>

      <header>
        <h1 className="text-3xl font-bold">{params?.title || 'Module Details'}</h1>
        <p className="text-white/60">Module ID: {moduleId}</p>
      </header>

      <div className="flex flex-col gap-3">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => push('LessonView', { 
              lessonId: lesson.id, 
              moduleTitle: params?.title, 
              moduleId: moduleId 
            })}
            className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between text-left"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-white/40">Lesson {lesson.id}</span>
              <span className="font-medium text-white">{lesson.title}</span>
            </div>
            <ChevronRight size={16} className="text-white/20" />
          </button>
        ))}
      </div>
    </div>
  );
};

export const LessonView: React.FC<{ params?: any }> = ({ params }) => {
  const { pop } = useNavigation();
  const [completed, setCompleted] = useState(false);
  
  // Добавляем состояние для отслеживания текущей страницы внутри урока
  const [currentPage, setCurrentPage] = useState(0);

  const moduleId = params?.moduleId || 'm1';
  const lessonId = params?.lessonId?.toString() || '1';
  
  const currentLesson = LESSONS_DATA[moduleId]?.find(l => l.id === lessonId) || {
    title: 'Cybersecurity Basics',
    pages: ["In this lesson, you'll learn the fundamental principles of staying safe online."]
  };

  const totalPages = currentLesson.pages.length;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setCompleted(true);

    const user = repository.getUser();
    if (user) {
      const xpEarned = 50;
      const updatedUser: User = {
        ...user,
        xp: user.xp + xpEarned,
        level: Math.floor((user.xp + xpEarned) / 500) + 1,
      };
      repository.upsertUser(updatedUser);

      // Update Lesson Progress
      const progress = repository.getLessonProgress(user.id);
      const moduleProgress = progress.find(p => p.moduleId === moduleId) || {
        userId: user.id,
        moduleId: moduleId,
        completedLessonIds: [],
        completionPercent: 0,
        updatedAt: Date.now()
      };
      
      if (!moduleProgress.completedLessonIds.includes(lessonId)) {
        moduleProgress.completedLessonIds.push(lessonId);
        moduleProgress.completionPercent = (moduleProgress.completedLessonIds.length / 5) * 100;
        moduleProgress.updatedAt = Date.now();
        repository.updateLessonProgress(user.id, moduleProgress);
      }

      // Trigger Achievements
      const allProgress = repository.getLessonProgress(user.id);
      const totalCompleted = allProgress.reduce((acc, p) => acc + p.completedLessonIds.length, 0);

      AchievementService.updateProgress(user.id, AchievementCriteria.LESSONS_COMPLETED, totalCompleted);
      AchievementService.updateProgress(user.id, AchievementCriteria.XP, updatedUser.xp);
    }

    setTimeout(() => {
      pop();
    }, 2000);
  };

  return (
    <div className="flex flex-col p-6 gap-6 h-full">
      <button onClick={pop} className="mt-8 flex items-center gap-2 text-[#FF6A00] font-bold">
        <ArrowLeft size={20} />
        Back
      </button>

      <header>
        <h1 className="text-2xl font-bold">Lesson {lessonId}</h1>
        <p className="text-white/60">{params?.moduleTitle}</p>
      </header>

      {/* 1) Заменили bg-white/5 на плотный, глубокий черный цвет bg-[#111111] для максимального контраста */}
      <div className="flex-1 bg-[#111111] border border-white/10 p-8 rounded-[40px] flex flex-col items-center justify-between text-center gap-6 shadow-2xl relative min-h-[420px]">
        {completed ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center my-auto gap-4"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white">Lesson Complete!</h3>
            <p className="text-white/40">+50 XP Earned</p>
          </motion.div>
        ) : (
          <>
            {/* Иконка и заголовок */}
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-16 h-16 bg-[#FF6A00]/10 rounded-2xl flex items-center justify-center text-[#FF6A00]">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">{currentLesson.title}</h3>
            </div>

            {/* Контентная зона и 4) Боковые стрелки навигации */}
            <div className="flex items-center justify-between w-full flex-1 my-4 gap-2">
              {/* Левая стрелка */}
              <div className="w-10 h-10 flex items-center justify-center">
                {currentPage > 0 && (
                  <button 
                    onClick={handlePrevPage}
                    className="w-full h-full rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
              </div>

              {/* Текст (2) Чистый белый text-white + 3) Парсер подсветки слов) */}
              <div className="flex-1 max-w-xs min-h-[100px] flex items-center justify-center">
                <p className="text-white text-base font-normal leading-relaxed text-center">
                  {formatHighlightedText(currentLesson.pages[currentPage])}
                </p>
              </div>

              {/* Правая стрелка */}
              <div className="w-10 h-10 flex items-center justify-center">
                {currentPage < totalPages - 1 && (
                  <button 
                    onClick={handleNextPage}
                    className="w-full h-full rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Индикатор текущей страницы (точки внизу) */}
            <div className="flex gap-1.5 justify-center items-center">
              {Array.from({ length: totalPages }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentPage ? 'w-5 bg-[#FF6A00]' : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Кнопка "Finish Lesson" появляется ТОЛЬКО на последней странице */}
            <div className="w-full min-h-[60px] flex items-center">
              {currentPage === totalPages - 1 ? (
                <button
                  onClick={handleComplete}
                  className="w-full bg-[#FF6A00] py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#FF6A00]/20 text-white transition-all active:scale-[0.98]"
                >
                  Finish Lesson
                </button>
              ) : (
                <button
                  onClick={handleNextPage}
                  className="w-full bg-white/10 py-4 rounded-2xl font-bold text-lg text-white transition-all active:scale-[0.98] border border-white/10"
                >
                  Next Page
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};