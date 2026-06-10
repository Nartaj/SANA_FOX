import { Topic, LessonModule, DailyChallengeCard, Achievement, AchievementCriteria, QuizQuestion } from '../types/models';
import phishingImg from '../assets/icons/Phishing-icon.png';
import virusesImg from '../assets/icons/Viruses-icon.png';
import habitsImg from '../assets/icons/Basic-habits-icon.png';
import background from '../assets/icons/Background.jpg';

export const SEED_MODULES: LessonModule[] = [
  { id: 'm1', title: 'Phishing', lessonCount: 5, icon: phishingImg },
  { id: 'm2', title: 'Viruses', lessonCount: 5, icon: virusesImg },
  { id: 'm3', title: 'Basic Habits', lessonCount: 5, icon: habitsImg },
  { id: 'm4', title: 'Background', lessonCount: 5, icon: background },
];

export const SEED_CHALLENGE_CARDS: DailyChallengeCard[] = [
  {
    id: 'c1',
    topic: Topic.PHISHING,
    prompt: "This email asks for your password to fix your account.",
    correctAnswer: false,
    explanation: "Real companies never ask for your password via email. This is a phishing attempt."
  },
  {
    id: 'c2',
    topic: Topic.HABITS,
    prompt: "A friend sends you a link to a funny video on a well-known site like YouTube.",
    correctAnswer: true,
    explanation: "Links to trusted sites from friends are usually safe, but always be cautious!"
  },
  {
    id: 'c3',
    topic: Topic.MALWARE,
    prompt: "A pop-up says your computer has 10 viruses and you must click to clean them.",
    correctAnswer: false,
    explanation: "Pop-ups claiming you have viruses are almost always scams to get you to download malware."
  },
  {
    id: 'c4',
    topic: Topic.PHISHING,
    prompt: "You receive a message from 'Apple' saying your account is locked and you need to verify your SSN.",
    correctAnswer: false,
    explanation: "Apple will never ask for your Social Security Number via a message. This is identity theft."
  },
  {
    id: 'c5',
    topic: Topic.HABITS,
    prompt: "Your bank's official app sends a notification about a recent transaction you made.",
    correctAnswer: true,
    explanation: "Official app notifications for your own activity are safe and helpful for tracking."
  },
  {
    id: 'c6',
    topic: Topic.SOCIAL_ENGINEERING,
    prompt: "Someone you don't know calls and says they are from IT and need your login to fix a server.",
    correctAnswer: false,
    explanation: "IT staff will never ask for your password over the phone. This is social engineering."
  },
  {
    id: 'c7',
    topic: Topic.HABITS,
    prompt: "You use a unique, long password for every one of your online accounts.",
    correctAnswer: true,
    explanation: "Using unique, strong passwords is one of the best ways to stay safe online."
  },
  {
    id: 'c8',
    topic: Topic.MALWARE,
    prompt: "You download a 'free' game from a website you've never heard of before.",
    correctAnswer: false,
    explanation: "Unknown sites often bundle malware with free downloads. Only use trusted stores."
  },
  {
    id: 'c9',
    topic: Topic.RISK_MANAGEMENT,
    prompt: "You enable Two-Factor Authentication (2FA) on your email account.",
    correctAnswer: true,
    explanation: "2FA adds an extra layer of security, making it much harder for hackers to get in."
  },
  {
    id: 'c10',
    topic: Topic.PHISHING,
    prompt: "An email from 'Netflix' says your payment failed and has a link to 'netflix-support.net'.",
    correctAnswer: false,
    explanation: "Check the URL! 'netflix-support.net' is not the real Netflix site. This is a scam."
  },
  {
    id: 'c11',
    topic: Topic.HABITS,
    prompt: "You lock your computer screen every time you step away from your desk.",
    correctAnswer: true,
    explanation: "Locking your screen prevents unauthorized people from accessing your data while you're away."
  },
  {
    id: 'c12',
    topic: Topic.SOCIAL_ENGINEERING,
    prompt: "A stranger at a coffee shop asks to borrow your USB drive to print a document.",
    correctAnswer: false,
    explanation: "Never plug your USB into unknown devices or let strangers use yours; it could spread malware."
  },
  {
    id: 'c13',
    topic: Topic.RISK_MANAGEMENT,
    prompt: "You regularly back up your important photos and documents to an external drive or cloud.",
    correctAnswer: true,
    explanation: "Backups ensure you don't lose your data if your device is lost, stolen, or broken."
  },
  {
    id: 'c14',
    topic: Topic.MALWARE,
    prompt: "You see an ad for a 'Free iPhone' and it asks you to install a profile on your phone.",
    correctAnswer: false,
    explanation: "Installing unknown profiles can give hackers full control over your mobile device."
  },
  {
    id: 'c15',
    topic: Topic.HABITS,
    prompt: "You check the 'lock' icon in your browser's address bar before entering personal info.",
    correctAnswer: true,
    explanation: "The lock icon means the connection is encrypted, which helps keep your data private."
  },
  {
    id: 'c16',
    topic: Topic.PHISHING,
    prompt: "A text message says you won a $1000 gift card and needs your address to ship it.",
    correctAnswer: false,
    explanation: "Unexpected 'prizes' via text are usually 'smishing' scams to steal your personal info."
  },
  {
    id: 'c17',
    topic: Topic.RISK_MANAGEMENT,
    prompt: "You keep your phone's operating system updated to the latest version.",
    correctAnswer: true,
    explanation: "Updates often include 'security patches' that fix holes hackers could use to get in."
  },
  {
    id: 'c18',
    topic: Topic.SOCIAL_ENGINEERING,
    prompt: "A 'friend' on social media asks for your phone number to help them 'recover' their account.",
    correctAnswer: false,
    explanation: "This is a common scam. They might use your number to hack your own accounts."
  },
  {
    id: 'c19',
    topic: Topic.HABITS,
    prompt: "You use a password manager to store and generate all your complex passwords.",
    correctAnswer: true,
    explanation: "Password managers are a safe and easy way to maintain high security across all sites."
  },
  {
    id: 'c20',
    topic: Topic.MALWARE,
    prompt: "You find a USB drive in the parking lot and plug it in to see who it belongs to.",
    correctAnswer: false,
    explanation: "Never plug in found USBs! They are often left on purpose to infect computers with viruses."
  }
];

export const SEED_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: "What is the most secure way to handle a suspicious email?",
    options: ["Open the link to see where it goes", "Reply and ask who they are", "Delete it and report it as phishing"],
    correctOptionIndex: 2,
    topic: Topic.PHISHING
  },
  {
    id: 'q2',
    question: "Which of these is a strong password?",
    options: ["password123", "Tr0ub4dor&3", "mybirthday1990"],
    correctOptionIndex: 1,
    topic: Topic.HABITS
  },
  {
    id: 'q3',
    question: "What does 2FA stand for?",
    options: ["Two-Factor Authentication", "Two-File Access", "Total Firewall Alert"],
    correctOptionIndex: 0,
    topic: Topic.RISK_MANAGEMENT
  },
  {
    id: 'q4',
    question: "What is 'Social Engineering'?",
    options: ["Building social media apps", "Manipulating people into giving up info", "Fixing computer hardware"],
    correctOptionIndex: 1,
    topic: Topic.SOCIAL_ENGINEERING
  },
  {
    id: 'q5',
    question: "Why should you update your software regularly?",
    options: ["To get new icons", "To fix security holes", "To make the computer faster"],
    correctOptionIndex: 1,
    topic: Topic.RISK_MANAGEMENT
  }
];

export const SEED_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'First Steps',
    description: 'Complete your first lesson.',
    criteriaType: AchievementCriteria.LESSONS_COMPLETED,
    criteriaValue: 1,
    category: 'Lessons'
  },
  {
    id: 'a2',
    title: 'Getting Serious',
    description: 'Complete 10 lessons.',
    criteriaType: AchievementCriteria.LESSONS_COMPLETED,
    criteriaValue: 10,
    category: 'Lessons'
  },
  {
    id: 'a3',
    title: 'Phishing Spotter',
    description: 'Get 8 correct answers in a Daily Challenge.',
    criteriaType: AchievementCriteria.ACCURACY,
    criteriaValue: 8,
    category: 'Safety Skills'
  },
  {
    id: 'a4',
    title: 'Perfect Run',
    description: 'Get 10/10 correct in a Daily Challenge.',
    criteriaType: AchievementCriteria.ACCURACY,
    criteriaValue: 10,
    category: 'Safety Skills'
  },
  {
    id: 'a5',
    title: 'Daily Discipline',
    description: 'Maintain a 3-day streak.',
    criteriaType: AchievementCriteria.STREAK,
    criteriaValue: 3,
    category: 'Streak'
  },
  {
    id: 'a6',
    title: 'One Week Strong',
    description: 'Maintain a 7-day streak.',
    criteriaType: AchievementCriteria.STREAK,
    criteriaValue: 7,
    category: 'Streak'
  },
  {
    id: 'a7',
    title: 'Security Mindset',
    description: 'Earn 500 XP.',
    criteriaType: AchievementCriteria.XP,
    criteriaValue: 500,
    category: 'XP'
  },
  {
    id: 'a8',
    title: 'Cyber Grinder',
    description: 'Earn 2000 XP.',
    criteriaType: AchievementCriteria.XP,
    criteriaValue: 2000,
    category: 'XP'
  },
  {
    id: 'a9',
    title: 'Assessment Pro',
    description: 'Get 90% accuracy in a Quick Check.',
    criteriaType: AchievementCriteria.ACCURACY,
    criteriaValue: 90,
    category: 'Accuracy'
  },
  {
    id: 'a10',
    title: 'No Weak Spots',
    description: 'Complete a Check with no weak topics.',
    criteriaType: AchievementCriteria.ACCURACY,
    criteriaValue: 1, // Special case: 1 means true/completed
    category: 'Safety Skills'
  }
];
