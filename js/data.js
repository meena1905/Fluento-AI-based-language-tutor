// ============================================================
// data.js — All static data for Fluento
// ============================================================

const LANGUAGES = [
  { name: 'Japanese',   flag: '🇯🇵', native: '日本語',   code: 'ja' },
  { name: 'Spanish',    flag: '🇪🇸', native: 'Español',   code: 'es' },
  { name: 'French',     flag: '🇫🇷', native: 'Français',  code: 'fr' },
  { name: 'Hindi',      flag: '🇮🇳', native: 'हिन्दी',      code: 'hi' },
  { name: 'Korean',     flag: '🇰🇷', native: '한국어',     code: 'ko' },
  { name: 'German',     flag: '🇩🇪', native: 'Deutsch',   code: 'de' },
  { name: 'Mandarin',   flag: '🇨🇳', native: '普通话',    code: 'zh' },
  { name: 'Arabic',     flag: '🇸🇦', native: 'العربية',   code: 'ar' },
  { name: 'Italian',    flag: '🇮🇹', native: 'Italiano',  code: 'it' },
  { name: 'Portuguese', flag: '🇧🇷', native: 'Português', code: 'pt' },
  { name: 'Russian',    flag: '🇷🇺', native: 'Русский',   code: 'ru' },
  { name: 'Turkish',    flag: '🇹🇷', native: 'Türkçe',    code: 'tr' },
];

const STAGES = [
  {
    id: 'beginner', name: 'Beginner',
    desc: 'Start from scratch — zero to basics',
    icon: '🌱', cls: 'beginner',
    lessons: [
      { id: 'greetings', title: 'Greetings & Hello',       desc: 'Say hi, introduce yourself',       tags: ['vocabulary', 'conversation'], icon: '👋', xp: 10 },
      { id: 'numbers',   title: 'Numbers 1–20',             desc: 'Count and use numbers',             tags: ['vocabulary'],                  icon: '🔢', xp: 10 },
      { id: 'colors',    title: 'Colors & Adjectives',      desc: 'Describe the world around you',    tags: ['vocabulary', 'grammar'],       icon: '🎨', xp: 10 },
      { id: 'family',    title: 'Family & People',          desc: 'Talk about your family',           tags: ['vocabulary', 'conversation'],  icon: '👨‍👩‍👧', xp: 10 },
    ]
  },
  {
    id: 'elementary', name: 'Elementary',
    desc: 'Build sentences and ask questions',
    icon: '📚', cls: 'elementary',
    lessons: [
      { id: 'food',       title: 'Food & Drinks',      desc: 'Order food, talk about meals',    tags: ['vocabulary', 'conversation'],  icon: '🍜', xp: 15 },
      { id: 'directions', title: 'Directions & Places', desc: 'Navigate and find places',        tags: ['vocabulary', 'grammar'],       icon: '🗺️', xp: 15 },
      { id: 'time',       title: 'Time & Days',         desc: 'Tell time, days, months',         tags: ['vocabulary', 'grammar'],       icon: '🕐', xp: 15 },
      { id: 'shopping',   title: 'Shopping & Money',    desc: 'Buy things, haggle politely',     tags: ['vocabulary', 'conversation'],  icon: '🛍️', xp: 15 },
    ]
  },
  {
    id: 'intermediate', name: 'Intermediate',
    desc: 'Express opinions and tell stories',
    icon: '🚀', cls: 'intermediate',
    lessons: [
      { id: 'emotions', title: 'Emotions & Feelings',       desc: 'Express how you feel',          tags: ['vocabulary', 'conversation'],  icon: '💬', xp: 20 },
      { id: 'travel',   title: 'Travel & Transport',        desc: 'Book trips, ask for help',       tags: ['conversation', 'grammar'],    icon: '✈️', xp: 20 },
      { id: 'hobbies',  title: 'Hobbies & Free Time',       desc: 'Talk about what you enjoy',     tags: ['conversation'],                icon: '🎸', xp: 20 },
      { id: 'past',     title: 'Talking About the Past',    desc: 'Past tense, memories',           tags: ['grammar', 'conversation'],    icon: '📖', xp: 20 },
    ]
  },
  {
    id: 'advanced', name: 'Advanced',
    desc: 'Master nuance, idioms, fluency',
    icon: '🏆', cls: 'advanced',
    lessons: [
      { id: 'idioms',    title: 'Idioms & Expressions', desc: 'Sound like a native speaker',    tags: ['vocabulary', 'conversation'], icon: '💡', xp: 30 },
      { id: 'debate',    title: 'Debate & Opinions',    desc: 'Argue, agree, persuade',          tags: ['conversation', 'grammar'],   icon: '🗣️', xp: 30 },
      { id: 'business',  title: 'Business & Formal',    desc: 'Emails, meetings, polite speech', tags: ['vocabulary', 'grammar'],     icon: '💼', xp: 30 },
      { id: 'culture',   title: 'Culture & Humor',      desc: 'Jokes, customs, references',     tags: ['conversation'],               icon: '🎭', xp: 30 },
    ]
  },
];

const LEVEL_THRESHOLDS = [
  { label: 'Beginner',     min: 0   },
  { label: 'Elementary',   min: 80  },
  { label: 'Intermediate', min: 200 },
  { label: 'Advanced',     min: 400 },
  { label: 'Fluent',       min: 700 },
];
