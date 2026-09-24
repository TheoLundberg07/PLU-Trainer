// PLU Trainer — drill logic

let deck = [];
let items = [];
let current = null;

let correctCount = 0;
let passCount = 0;
let streak = 0;

const imageEl = document.getElementById("produce-image");
const inputEl = document.getElementById("guess-input");
const passBtn = document.getElementById("pass-btn");
const revealEl = document.getElementById("reveal");
const cardEl = document.getElementById("card");

const statCorrect = document.getElementById("stat-correct");
const statPass = document.getElementById("stat-pass");
const statStreak = document.getElementById("stat-streak");

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
  imageEl.alt = "Guess the PLU code";
  inputEl.value = "";
  revealEl.textContent = "";
  cardEl.classList.remove("flash-correct", "flash-wrong");
  inputEl.disabled = false;
  passBtn.disabled = false;
  inputEl.focus();
}

function normalize(code) {
  return code.replace(/\D/g, "");
}

function handleCorrect() {
  correctCount++;
  streak++;
  updateStats();
  cardEl.classList.remove("flash-wrong");
  cardEl.classList.add("flash-correct");
  inputEl.disabled = true;
  passBtn.disabled = true;
  setTimeout(nextItem, 550);
}

function handleWrong() {
  streak = 0;
  updateStats();
  cardEl.classList.remove("flash-correct");
  cardEl.classList.add("flash-wrong");
  inputEl.value = "";
}

function handlePass() {
  passCount++;
  streak = 0;
  updateStats();
  revealEl.innerHTML = `Code: <strong>${current.code}</strong> — ${current.name}`;
  cardEl.classList.remove("flash-correct");
  cardEl.classList.add("flash-wrong");
  inputEl.disabled = true;
  passBtn.disabled = true;
  setTimeout(nextItem, 1200);
}

function updateStats() {
  statCorrect.textContent = correctCount;
  statPass.textContent = passCount;
  statStreak.textContent = streak;
}

function submitGuess() {
  if (inputEl.disabled) return;
  const guess = normalize(inputEl.value);
  if (!guess) return;
  if (guess === current.code) {
    handleCorrect();
  } else {
    handleWrong();
  }
}

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitGuess();
});

inputEl.addEventListener("input", () => {
  inputEl.value = inputEl.value.replace(/\D/g, "");
});

passBtn.addEventListener("click", () => {
  if (!inputEl.disabled) handlePass();
});

const numpadEl = document.getElementById("numpad");
const numpadToggle = document.getElementById("numpad-toggle");

numpadToggle.addEventListener("click", () => {
  const isHidden = numpadEl.classList.toggle("hidden");
  numpadToggle.classList.toggle("active", !isHidden);
  numpadToggle.textContent = isHidden ? "Show numpad" : "Hide numpad";
  // when the numpad is active, suppress the native mobile keyboard;
  // when it's off, restore the normal numeric keyboard for typing
  inputEl.setAttribute("inputmode", isHidden ? "numeric" : "none");
  if (isHidden) inputEl.focus();
});

numpadEl.addEventListener("click", (e) => {
  if (inputEl.disabled) return;
  const btn = e.target.closest(".num-key");
  if (!btn) return;
  const key = btn.dataset.key;

  if (key === "back") {
    inputEl.value = inputEl.value.slice(0, -1);
  } else if (key === "submit") {
    submitGuess();
  } else {
    inputEl.value += key;
  }
  inputEl.focus();
});

fetch("data/plu.json")
  .then((r) => r.json())
  .then((data) => {
    items = data;
    deck = shuffle(items);
    nextItem();
  })
  .catch((err) => {
    revealEl.textContent =
      "Could not load data/plu.json — check the file exists and is valid JSON.";
    console.error(err);
  });
