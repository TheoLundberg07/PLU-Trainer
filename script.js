// PLU Trainer — drill logic

let deck = [];
let items = [];
let current = null;

let correctCount = 0;
let passCount = 0;
let streak = 0;

const imageEl = document.getElementById('produce-image');
const inputEl = document.getElementById('guess-input');
const passBtn = document.getElementById('pass-btn');
const revealEl = document.getElementById('reveal');
const cardEl = document.getElementById('card');

const statCorrect = document.getElementById('stat-correct');
const statPass = document.getElementById('stat-pass');
const statStreak = document.getElementById('stat-streak');

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function refillDeckIfEmpty() {
  if (deck.length === 0) {
    deck = shuffle(items);
  }
}

function nextItem() {
  refillDeckIfEmpty();
  current = deck.pop();
  imageEl.src = `images/${current.image}`;
  imageEl.alt = 'Guess the PLU code';
  inputEl.value = '';
  revealEl.textContent = '';
  cardEl.classList.remove('flash-correct', 'flash-wrong');
  inputEl.disabled = false;
  passBtn.textContent = 'Pass';
  inputEl.focus();
}

function normalize(code) {
  return code.replace(/\D/g, '');
}

function handleCorrect() {
  correctCount++;
  streak++;
  updateStats();
  cardEl.classList.remove('flash-wrong');
  cardEl.classList.add('flash-correct');
  inputEl.disabled = true;
  setTimeout(nextItem, 550);
}

function handleWrong() {
  streak = 0;
  updateStats();
  cardEl.classList.remove('flash-correct');
  cardEl.classList.add('flash-wrong');
  inputEl.value = '';
}

function handlePass() {
  passCount++;
  streak = 0;
  updateStats();
  revealEl.innerHTML = `Code: <strong>${current.code}</strong> — ${current.name}`;
  cardEl.classList.remove('flash-correct', 'flash-wrong');
  inputEl.disabled = true;
  passBtn.textContent = 'Next';
}

function updateStats() {
  statCorrect.textContent = correctCount;
  statPass.textContent = passCount;
  statStreak.textContent = streak;
}

inputEl.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const guess = normalize(inputEl.value);
  if (!guess) return;
  if (guess === current.code) {
    handleCorrect();
  } else {
    handleWrong();
  }
});

inputEl.addEventListener('input', () => {
  inputEl.value = inputEl.value.replace(/\D/g, '');
});

passBtn.addEventListener('click', () => {
  if (inputEl.disabled) {
    // already passed/revealed for this item — move on
    nextItem();
  } else {
    handlePass();
  }
});

fetch('data/plu.json')
  .then((r) => r.json())
  .then((data) => {
    items = data;
    deck = shuffle(items);
    nextItem();
  })
  .catch((err) => {
    revealEl.textContent = 'Could not load data/plu.json — check the file exists and is valid JSON.';
    console.error(err);
  });
