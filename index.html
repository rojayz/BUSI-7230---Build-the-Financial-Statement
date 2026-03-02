// ---------- Data ----------
const transactions = [
  { id: 1, text: "Provided services on account for $5,000.", correct: "IS", explanation: "Primarily revenue on the Income Statement (A/R also increases on the Balance Sheet)." },
  { id: 2, text: "Purchased equipment for $12,000 cash.", correct: "BS", explanation: "Equipment is an asset (Balance Sheet). (Also an investing cash outflow.)" },
  { id: 3, text: "Paid $2,000 of wages in cash.", correct: "CF", explanation: "Cash paid for wages is an Operating cash outflow (also an expense on the Income Statement)." },
  { id: 4, text: "Received $3,000 cash for services to be performed next month.", correct: "BS", explanation: "Unearned Revenue is a liability (Balance Sheet) until earned." },
  { id: 5, text: "Recorded one month of depreciation expense, $600.", correct: "IS", explanation: "Depreciation is an expense on the Income Statement." },
  { id: 6, text: "Collected $1,200 cash from a customer who previously owed money.", correct: "CF", explanation: "Cash collections are Operating cash inflows (also reduces A/R on the Balance Sheet)." },
  { id: 7, text: "Owner invested $20,000 cash into the business.", correct: "CF", explanation: "Owner contributions are Financing cash inflows." },
  { id: 8, text: "Paid $900 cash for this month’s rent.", correct: "CF", explanation: "Rent paid is an Operating cash outflow (also rent expense)." },
  { id: 9, text: "Purchased $4,000 of inventory on credit.", correct: "BS", explanation: "Inventory (asset) and Accounts Payable (liability) change — Balance Sheet." },
  { id: 10, text: "Declared and paid $500 in dividends.", correct: "CF", explanation: "Dividends paid are Financing cash outflows (and reduce equity)." },
];

const lineItems = [
  { id: "li1", label: "Service Revenue", bucket: "IS:Revenue", explanation: "Revenue belongs on the Income Statement under revenues." },
  { id: "li2", label: "Wage Expense", bucket: "IS:Expense", explanation: "Wages are an expense on the Income Statement." },
  { id: "li3", label: "Equipment", bucket: "BS:Asset", explanation: "Equipment is a long-term asset on the Balance Sheet." },
  { id: "li4", label: "Accounts Payable", bucket: "BS:Liability", explanation: "Accounts Payable is a liability on the Balance Sheet." },
  { id: "li5", label: "Retained Earnings", bucket: "BS:Equity", explanation: "Retained Earnings is part of equity on the Balance Sheet." },
  { id: "li6", label: "Cash collected from customers", bucket: "CF:Operating", explanation: "Collections from customers are Operating cash inflows." },
  { id: "li7", label: "Cash paid for rent", bucket: "CF:Operating", explanation: "Rent paid is an Operating cash outflow." },
  { id: "li8", label: "Purchase of equipment (cash)", bucket: "CF:Investing", explanation: "Buying equipment is an Investing cash outflow." },
  { id: "li9", label: "Owner cash contribution", bucket: "CF:Financing", explanation: "Owner contributions are Financing cash inflows." },
  { id: "li10", label: "Depreciation Expense", bucket: "IS:Expense", explanation: "Depreciation is an Income Statement expense." },
];

// ---------- State ----------
const state = {
  txIndex: 0,
  score: 0,
  review: [],
  selectedLineItemId: null,
  remainingLineItems: [...lineItems],
};

// ---------- Elements ----------
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const resultsScreen = document.getElementById("resultsScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const roundLabel = document.getElementById("roundLabel");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");

const round1Area = document.getElementById("round1Area");
const questionText = document.getElementById("questionText");

const round2Area = document.getElementById("round2Area");
const itemsList = document.getElementById("itemsList");
const selectedItemBanner = document.getElementById("selectedItemBanner");

const finalScoreText = document.getElementById("finalScoreText");
const reviewArea = document.getElementById("reviewArea");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModalBtn");

// ---------- Helpers ----------
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function showScreen(which) {
  hide(startScreen); hide(gameScreen); hide(resultsScreen);
  if (which === "start") show(startScreen);
  if (which === "game") show(gameScreen);
  if (which === "results") show(resultsScreen);
}

function openModal(title, body) {
  modalTitle.textContent = title;
  modalBody.textContent = body;
  show(modalOverlay);
}

function closeModal() { hide(modalOverlay); }

function updateScore() { scoreText.textContent = state.score; }

function resetGame() {
  state.txIndex = 0;
  state.score = 0;
  state.review = [];
  state.selectedLineItemId = null;
  state.remainingLineItems = [...lineItems];
  updateScore();
}

function normalizeRound1Label(code) {
  if (code === "IS") return "Income Statement";
  if (code === "BS") return "Balance Sheet";
  if (code === "CF") return "Cash Flow";
  return code;
}

// ---------- Round 1 ----------
function renderRound1() {
  roundLabel.textContent = "Round 1";
  show(round1Area);
  hide(round2Area);

  const tx = transactions[state.txIndex];
  progressText.textContent = `Question ${state.txIndex + 1} of ${transactions.length}`;
  questionText.textContent = tx.text;
}

function handleRound1Answer(answer) {
  const tx = transactions[state.txIndex];
  const correct = tx.correct;

  const isCorrect = answer === correct;
  if (isCorrect) state.score += 1;

  state.review.push({
    type: "Round 1",
    prompt: tx.text,
    yourAnswer: normalizeRound1Label(answer),
    correctAnswer: normalizeRound1Label(correct),
    explanation: tx.explanation,
    isCorrect
  });

  updateScore();

  if (!isCorrect) {
    openModal("Not quite.", tx.explanation);
    return;
  }

  state.txIndex += 1;
  if (state.txIndex >= transactions.length) {
    startRound2();
  } else {
    renderRound1();
  }
}

// ---------- Round 2 ----------
function startRound2() {
  roundLabel.textContent = "Round 2";
  hide(round1Area);
  show(round2Area);
  renderLineItems();
  updateSelectedBanner();
  progressText.textContent = `Place ${state.remainingLineItems.length} items`;
}

function renderLineItems() {
  itemsList.innerHTML = "";
  state.remainingLineItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = item.label;
    div.dataset.itemId = item.id;

    if (state.selectedLineItemId === item.id) div.classList.add("selected");

    div.addEventListener("click", () => {
      state.selectedLineItemId = item.id;
      renderLineItems();
      updateSelectedBanner();
    });

    itemsList.appendChild(div);
  });

  progressText.textContent = `Place ${state.remainingLineItems.length} items`;
}

function updateSelectedBanner() {
  if (!state.selectedLineItemId) {
    hide(selectedItemBanner);
    selectedItemBanner.textContent = "";
    return;
  }
  const item = state.remainingLineItems.find(x => x.id === state.selectedLineItemId);
  if (!item) return;
  selectedItemBanner.textContent = `Selected: ${item.label} — now click the correct bucket.`;
  show(selectedItemBanner);
}

function handleBucketClick(bucket) {
  if (!state.selectedLineItemId) {
    openModal("Select an item first.", "Click a line item on the left, then click a bucket on the right.");
    return;
  }

  const item = state.remainingLineItems.find(x => x.id === state.selectedLineItemId);
  if (!item) return;

  const isCorrect = bucket === item.bucket;
  if (isCorrect) state.score += 1;
  updateScore();

  state.review.push({
    type: "Round 2",
    prompt: `Place: ${item.label}`,
    yourAnswer: bucket,
    correctAnswer: item.bucket,
    explanation: item.explanation,
    isCorrect
  });

  if (!isCorrect) {
    openModal("Not quite.", item.explanation);
    return;
  }

  state.remainingLineItems = state.remainingLineItems.filter(x => x.id !== item.id);
  state.selectedLineItemId = null;

  if (state.remainingLineItems.length === 0) {
    showResults();
  } else {
    renderLineItems();
    updateSelectedBanner();
  }
}

// ---------- Results ----------
function showResults() {
  showScreen("results");
  finalScoreText.textContent = state.score;

  reviewArea.innerHTML = "";
  state.review.forEach(r => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <strong>${r.type}</strong><br/>
      ${r.prompt}<br/>
      <span class="muted">Your answer:</span> ${r.yourAnswer} |
      <span class="muted">Correct:</span> ${r.correctAnswer}<br/>
      <span class="muted">Why:</span> ${r.explanation}
    `;
    reviewArea.appendChild(div);
  });
}

// ---------- Events ----------
startBtn.addEventListener("click", () => {
  resetGame();
  showScreen("game");
  renderRound1();
});

restartBtn.addEventListener("click", () => {
  resetGame();
  showScreen("start");
});

closeModalBtn.addEventListener("click", () => {
  closeModal();
});

// Round 1 answer buttons
document.querySelectorAll("[data-answer]").forEach(btn => {
  btn.addEventListener("click", () => {
    handleRound1Answer(btn.dataset.answer);
  });
});

// Round 2 bucket buttons
document.querySelectorAll(".bucket").forEach(btn => {
  btn.addEventListener("click", () => {
    handleBucketClick(btn.dataset.bucket);
  });
});

// Initialize
showScreen("start");
hide(modalOverlay);
