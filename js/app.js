// ============================================================
// app.js — Fluento Application Logic
// Talks to local proxy server (server.js) to call Groq API
// ============================================================

const API_BASE = 'http://localhost:3000';

// ── APP STATE ──
let state = {
  lang: null,
  xp: 0,
  streak: 0,
  completedLessons: new Set(),
  currentLesson: null,
  currentStage: null,
  history: [],
  sending: false,
};

// ══════════════════════════════════════
// SCREEN NAVIGATION
// ══════════════════════════════════════

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id + '-screen').classList.add('active');
}

function goBack(to) {
  if (to === 'lang') {
    showScreen('lang');
  } else if (to === 'roadmap') {
    showScreen('roadmap');
    renderRoadmap();
  }
}

// ══════════════════════════════════════
// BUILD LANGUAGE GRID
// ══════════════════════════════════════

function buildLangGrid() {
  const grid = document.getElementById('lang-grid');
  LANGUAGES.forEach(l => {
    const c = document.createElement('div');
    c.className = 'lang-card';
    c.innerHTML = `
      <div class="lang-flag">${l.flag}</div>
      <div class="lang-name">${l.name}</div>
      <div class="lang-native">${l.native}</div>
      <div class="lang-level-tag">10+ lessons</div>
    `;
    c.onclick = () => selectLang(l);
    grid.appendChild(c);
  });
}

function selectLang(l) {
  state.lang = l;
  state.xp = 0;
  state.streak = 0;
  state.completedLessons = new Set();
  state.history = [];

  document.getElementById('rmap-lang-name').textContent = l.name;
  document.getElementById('rmap-lang-flag').textContent = l.flag + ' Your learning path';

  updateStats();
  renderRoadmap();
  showScreen('roadmap');
}

// ══════════════════════════════════════
// STATS & XP
// ══════════════════════════════════════

function getLevel(xp) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].min) return LEVEL_THRESHOLDS[i];
  }
  return LEVEL_THRESHOLDS[0];
}

function updateStats() {
  const lvl = getLevel(state.xp);
  document.getElementById('stat-xp').textContent = '⚡ ' + state.xp + ' XP';
  document.getElementById('stat-streak').textContent = '🔥 ' + state.streak;
  document.getElementById('stat-level').textContent = '🎯 ' + lvl.label;
  document.getElementById('lesson-xp-chip').textContent = '⚡ ' + state.xp + ' XP';

  const next = LEVEL_THRESHOLDS.find(t => t.min > state.xp) || { min: state.xp + 1, label: 'Max' };
  const pct = Math.min(((state.xp - lvl.min) / (next.min - lvl.min)) * 100, 100);
  document.getElementById('xp-fill').style.width = pct + '%';
  document.getElementById('xp-label-l').textContent = state.xp + ' XP';
  document.getElementById('xp-label-r').textContent = 'Next: ' + next.label + ' (' + next.min + ' XP)';
}

function showXPToast(msg) {
  const t = document.getElementById('xp-toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// ══════════════════════════════════════
// ROADMAP
// ══════════════════════════════════════

function renderRoadmap() {
  updateStats();
  const body = document.getElementById('roadmap-body');
  body.innerHTML = '';

  STAGES.forEach((stage, si) => {
    const completedInStage = stage.lessons.filter(l => state.completedLessons.has(l.id)).length;
    const sec = document.createElement('div');
    sec.className = 'stage-section';

    const hdr = document.createElement('div');
    hdr.className = 'stage-header ' + stage.cls;
    hdr.innerHTML = `
      <div class="stage-icon">${stage.icon}</div>
      <div class="stage-info">
        <div class="stage-name">${stage.name}</div>
        <div class="stage-desc">${stage.desc}</div>
      </div>
      <div class="stage-progress">${completedInStage}/${stage.lessons.length} done</div>
    `;
    sec.appendChild(hdr);

    const path = document.createElement('div');
    path.className = 'lesson-path';

    const prevStage = si > 0 ? STAGES[si - 1] : null;
    const stageUnlocked = si === 0 ||
      (prevStage && prevStage.lessons.filter(l => state.completedLessons.has(l.id)).length >= Math.ceil(prevStage.lessons.length / 2));

    stage.lessons.forEach((lesson, li) => {
      const lessonUnlocked = stageUnlocked && (li === 0 || state.completedLessons.has(stage.lessons[li - 1].id));
      const done = state.completedLessons.has(lesson.id);
      const isActive = lessonUnlocked && !done;
      const circleState = done ? 'done' : isActive ? 'active' : 'locked';

      const tagsHTML = lesson.tags.map(t => `<span class="node-tag ${t}">${t}</span>`).join('');

      const node = document.createElement('div');
      node.className = 'lesson-node' + (lessonUnlocked ? '' : ' locked');
      node.innerHTML = `
        <div class="node-circle ${circleState}">
          ${done ? '✓' : lesson.icon}
          ${isActive ? '<div class="node-badge">GO</div>' : ''}
        </div>
        <div class="node-info">
          <div class="node-title">${lesson.title}</div>
          <div class="node-desc">${lesson.desc}</div>
          <div class="node-tags">${tagsHTML}<span class="node-tag">+${lesson.xp} XP</span></div>
        </div>
        <div class="node-arrow">${lessonUnlocked ? '›' : '🔒'}</div>
      `;

      if (lessonUnlocked) node.onclick = () => startLesson(stage, lesson);
      path.appendChild(node);

      if (li < stage.lessons.length - 1) {
        const line = document.createElement('div');
        line.className = 'connector-line';
        path.appendChild(line);
      }
    });

    sec.appendChild(path);
    body.appendChild(sec);
  });
}

// ══════════════════════════════════════
// LESSON
// ══════════════════════════════════════

function startLesson(stage, lesson) {
  state.currentLesson = lesson;
  state.currentStage = stage;
  state.history = [];

  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('lesson-stage-badge').textContent = stage.name;
  document.getElementById('messages').innerHTML = '';
  document.getElementById('phrase-card').style.display = 'none';
  document.getElementById('chat-input').value = '';
  document.getElementById('chat-input').disabled = true;
  document.getElementById('send-btn').disabled = true;
  document.getElementById('hint-text').textContent = 'Your AI tutor is preparing the lesson...';

  showScreen('lesson');
  beginLesson();
}

async function beginLesson() {
  addTyping();
  try {
    const res = await callAI([{ role: 'user', content: 'Start the lesson now!' }]);
    removeTyping();

    state.history.push({ role: 'user', content: 'Start the lesson now!' });
    state.history.push({ role: 'assistant', content: res.raw });

    renderBotMsg(res.parsed);

    document.getElementById('chat-input').disabled = false;
    document.getElementById('send-btn').disabled = false;
    document.getElementById('chat-input').focus();
    document.getElementById('hint-text').textContent =
      'Reply in ' + state.lang.name + ' or English — the tutor will correct and guide you!';

  } catch (e) {
    removeTyping();
    addMsg('bot', '⚠️ Server not running! Open a terminal and run: node server.js');
    console.error('API Error:', e);
  }
}

async function sendMsg() {
  const input = document.getElementById('chat-input');
  const txt = input.value.trim();
  if (!txt || state.sending) return;

  state.sending = true;
  input.value = '';
  document.getElementById('send-btn').disabled = true;

  addMsg('user', txt);
  addTyping();

  state.history.push({ role: 'user', content: txt });

  try {
    const res = await callAI(state.history);
    removeTyping();

    state.history.push({ role: 'assistant', content: res.raw });
    renderBotMsg(res.parsed);

    if (res.parsed.feedbackType === 'correct') {
      state.xp += (res.parsed.xpDelta || 10);
      state.streak++;
      showXPToast('+' + (res.parsed.xpDelta || 10) + ' XP 🎉');
    } else if (res.parsed.feedbackType === 'wrong') {
      state.streak = 0;
    }
    updateStats();

    const correctCount = state.history
      .filter((h, i) => i % 2 === 1)
      .filter(h => {
        try { return JSON.parse(h.content).feedbackType === 'correct'; }
        catch { return false; }
      }).length;

    if (correctCount >= 3 && !state.completedLessons.has(state.currentLesson.id)) {
      state.completedLessons.add(state.currentLesson.id);
      setTimeout(() => showXPToast('Lesson complete! 🏆'), 800);
    }

  } catch (e) {
    removeTyping();
    addMsg('bot', '⚠️ Server error. Make sure server.js is running!');
    console.error('API Error:', e);
  }

  state.sending = false;
  document.getElementById('send-btn').disabled = false;
  document.getElementById('chat-input').focus();
}

// ══════════════════════════════════════
// AI CALL → goes to local proxy server
// ══════════════════════════════════════

async function callAI(messages) {
  const response = await fetch(API_BASE + '/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: buildSystemPrompt(),
      messages: messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Server error');
  }

  const data = await response.json();
  const raw = data.content;
  const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
  return { raw, parsed };
}

// ══════════════════════════════════════
// SYSTEM PROMPT
// ══════════════════════════════════════

function buildSystemPrompt() {
  return `You are Fluento, a warm, encouraging, expert ${state.lang.name} language tutor. You are teaching the lesson: "${state.currentLesson.title}".

Your teaching method:
1. On the FIRST turn: warmly introduce the lesson topic. Teach 1-2 key ${state.lang.name} phrases/words with romanization (if needed) and English meaning. Ask the student to try using them.
2. On subsequent turns: evaluate their attempt (correct/partial/wrong), correct mistakes clearly and kindly, celebrate successes, then introduce the next phrase or deepen the conversation.
3. Always stay on the lesson topic: ${state.currentLesson.title} — ${state.currentLesson.desc}.
4. Keep messages short, fun, encouraging. Use emojis occasionally.
5. After 6+ turns, offer to wrap up or continue with bonus phrases.

ALWAYS respond with ONLY valid JSON — no extra text, no markdown backticks:
{
  "message": "Your tutor message here",
  "phraseOfMoment": "The key ${state.lang.name} phrase to practice right now",
  "phraseRomanized": "Pronunciation guide / romanization (empty string if not needed)",
  "phraseEnglish": "English meaning of the phrase",
  "feedbackType": "correct|partial|wrong|none",
  "correctedForm": "Correct ${state.lang.name} if they made an error, or null",
  "correctionTip": "Brief grammar/pronunciation tip, or null",
  "xpDelta": 10
}`;
}

// ══════════════════════════════════════
// CHAT UI HELPERS
// ══════════════════════════════════════

function renderBotMsg(p) {
  addMsg('bot', p.message);

  if (p.correctedForm && p.correctionTip) {
    addCorrection(p.correctedForm, p.correctionTip, p.feedbackType);
  } else if (p.feedbackType && p.feedbackType !== 'none') {
    addFeedbackTag(p.feedbackType);
  }

  if (p.phraseOfMoment) {
    document.getElementById('phrase-card').style.display = 'block';
    document.getElementById('phrase-main').textContent = p.phraseOfMoment;
    document.getElementById('phrase-roman').textContent = p.phraseRomanized || '';
    document.getElementById('phrase-english').textContent = p.phraseEnglish || '';
  }
}

function addMsg(role, text) {
  const msgs = document.getElementById('messages');
  const w = document.createElement('div');
  w.className = 'msg ' + role;
  const b = document.createElement('div');
  b.className = 'msg-bubble';
  b.textContent = text;
  w.appendChild(b);
  msgs.appendChild(w);
  msgs.scrollTop = msgs.scrollHeight;
}

function addFeedbackTag(type) {
  const msgs = document.getElementById('messages');
  const last = msgs.lastElementChild;
  if (!last) return;
  const row = document.createElement('div');
  row.className = 'feedback-row';
  const tag = document.createElement('span');
  tag.className = 'ftag ' + type;
  tag.textContent = type === 'correct' ? '✓ Correct!' : type === 'partial' ? 'Almost there!' : 'Not quite — keep trying!';
  row.appendChild(tag);
  last.appendChild(row);
}

function addCorrection(corrected, tip, type) {
  const msgs = document.getElementById('messages');
  const last = msgs.lastElementChild;
  if (!last) return;

  const row = document.createElement('div');
  row.className = 'feedback-row';
  const tag = document.createElement('span');
  tag.className = 'ftag ' + (type || 'wrong');
  tag.textContent = type === 'partial' ? 'Almost there!' : "Let's fix that";
  row.appendChild(tag);
  last.appendChild(row);

  const box = document.createElement('div');
  box.className = 'correction-box';
  box.innerHTML = 'Correct form: <span class="cf">' + corrected + '</span><br><span style="opacity:.75;font-size:12px">' + tip + '</span>';
  last.appendChild(box);

  msgs.scrollTop = msgs.scrollHeight;
}

function addTyping() {
  const msgs = document.getElementById('messages');
  const w = document.createElement('div');
  w.className = 'msg bot';
  w.id = 'typing-wrap';
  w.innerHTML = '<div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
  msgs.appendChild(w);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-wrap');
  if (t) t.remove();
}

document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMsg();
});

buildLangGrid();


// Speak the tutor message in English
function speakText(text) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang.startsWith('en'));
  if (match) utterance.voice = match;
  window.speechSynthesis.speak(utterance);
}

// ══════════════════════════════════════
// TEXT TO SPEECH
// ══════════════════════════════════════

const LANG_SPEECH_CODES = {
  'Japanese':'ja-JP','Spanish':'es-ES','French':'fr-FR','Hindi':'hi-IN',
  'Korean':'ko-KR','German':'de-DE','Mandarin':'zh-CN','Arabic':'ar-SA',
  'Italian':'it-IT','Portuguese':'pt-BR','Russian':'ru-RU','Turkish':'tr-TR',
};

function speakPhrase(text) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const langCode = LANG_SPEECH_CODES[state.lang?.name] || 'en-US';
  utterance.lang = langCode;
  utterance.rate = 0.82;
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
  if (match) utterance.voice = match;
  const btn = document.getElementById('speak-btn');
  if (btn) {
    btn.textContent = '🔊 Speaking...';
    btn.disabled = true;
    utterance.onend = () => { btn.textContent = '🔊 Hear it again'; btn.disabled = false; };
  }
  window.speechSynthesis.speak(utterance);
}

window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
