const statusEl = document.getElementById('status');
const counterEl = document.getElementById('counter');
const questionEl = document.getElementById('question');
const nextBtn = document.getElementById('nextBtn');
const copyBtn = document.getElementById('copyBtn');

const QUESTIONS_URL = './questions.csv';

let questions = [];
let shuffledQuestions = [];
let currentQuestion = '';
let seenCount = 0;

function setStatus(message) {
  if (statusEl) {
    statusEl.textContent = message;
  }
}

function parseQuestionsCsv(csvText) {
  const lines = csvText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  return lines
    .slice(1)
    .map((line) => {
      if (line.startsWith('"') && line.endsWith('"')) {
        return line.slice(1, -1).replace(/""/g, '"').trim();
      }

      return line.replace(/^question,?/i, '').trim();
    })
    .filter(Boolean);
}

function shuffle(values) {
  const output = values.slice();

  for (let index = output.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[randomIndex]] = [output[randomIndex], output[index]];
  }

  return output;
}

function refreshCounter() {
  if (counterEl) {
    counterEl.textContent = `${seenCount} / ${questions.length || 0}`;
  }
}

function renderQuestion(question) {
  currentQuestion = question;
  if (questionEl) {
    questionEl.textContent = question;
  }
  seenCount += 1;
  refreshCounter();
}

function nextQuestion() {
  if (!shuffledQuestions.length) {
    shuffledQuestions = shuffle(questions);
    seenCount = 0;
  }

  const next = shuffledQuestions.pop();
  renderQuestion(next);
  setStatus('Ready for the next round.');
}

async function copyQuestion() {
  try {
    await navigator.clipboard.writeText(currentQuestion);
    setStatus('Question copied to clipboard.');
  } catch {
    setStatus('Copy failed. Select the question and copy it manually.');
  }
}

async function loadQuestions() {
  const response = await fetch(QUESTIONS_URL);

  if (!response.ok) {
    throw new Error(`Failed to load questions.csv (${response.status})`);
  }

  const csvText = await response.text();
  questions = parseQuestionsCsv(csvText);

  if (!questions.length) {
    throw new Error('No questions were found in questions.csv');
  }

  shuffledQuestions = shuffle(questions);
  seenCount = 0;
  nextQuestion();

  if (nextBtn) {
    nextBtn.disabled = false;
  }

  if (copyBtn) {
    copyBtn.disabled = false;
  }

  setStatus('Loaded from questions.csv.');
  refreshCounter();
}

if (nextBtn) {
  nextBtn.addEventListener('click', nextQuestion);
}

if (copyBtn) {
  copyBtn.addEventListener('click', copyQuestion);
}

document.addEventListener('keydown', (event) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    nextQuestion();
  }
});

loadQuestions().catch((error) => {
  setStatus('Unable to load questions.csv.');

  if (questionEl) {
    questionEl.textContent = error.message;
  }

  if (nextBtn) {
    nextBtn.disabled = true;
  }

  if (copyBtn) {
    copyBtn.disabled = true;
  }

  refreshCounter();
});