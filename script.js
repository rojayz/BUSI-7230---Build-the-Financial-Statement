// -----------------------
// BlueWave Coffee Game
// Upgraded UI: statement panels + statement-style placement + progress bar
// -----------------------

const fmtMoney = (n) => {
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n);
  return `${sign}$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

// ---------- Round 1: Transactions (primary statement classification) ----------
const transactions = [
  { id: 1, text: "Provided coffee catering services on account.", amount: 5000, correct: "IS", explanation: "Primarily revenue on the Income Statement (A/R also increases on the Balance Sheet)." },
  { id: 2, text: "Purchased a commercial espresso machine for cash.", amount: 12000, correct: "BS", explanation: "Equipment is an asset (Balance Sheet). The cash payment is also an investing outflow on the Cash Flow Statement." },
  { id: 3, text: "Paid barista wages in cash.", amount: 2000, correct: "CF", explanation: "Cash paid for wages is an Operating cash outflow (also an expense on the Income Statement)." },
  { id: 4, text: "Received cash for gift cards to be redeemed next month.", amount: 3000, correct: "BS", explanation: "This creates Unearned Revenue (a liability) until earned—primary classification: Balance Sheet." },
  { id: 5, text: "Recorded monthly depreciation on equipment.", amount: 600, correct: "IS", explanation: "Depreciation is an expense on the Income Statement (and increases Accumulated Depreciation on the Balance Sheet)." },
  { id: 6, text: "Collected cash from customers who previously owed money.", amount: 1200, correct: "CF", explanation: "Cash collections from customers are Operating cash inflows (A/R decreases on the Balance Sheet)." },
  { id: 7, text: "Owner invested cash into BlueWave Coffee.", amount: 20000, correct: "CF", explanation: "Owner contributions are Financing cash inflows (and increase equity on the Balance Sheet)." },
  { id: 8, text: "Paid this month’s rent in cash.", amount: 900, correct: "CF", explanation: "Rent paid is an Operating cash outflow (also rent expense on the Income Statement)." },
  { id: 9, text: "Purchased coffee bean inventory on credit.", amount: 4000, correct: "BS", explanation: "Inventory (asset) increases and Accounts Payable (liability) increases—primary classification: Balance Sheet." },
  { id: 10, text: "Declared and paid dividends to the owner.", amount: 500, correct: "CF", explanation: "Dividends paid are Financing cash outflows and reduce equity." },
];

// ---------- Round 2: Line items (place into statement sections) ----------
const lineItems = [
  { id: "li1", label: "Service Revenue", amount: 5000, bucket: "IS:Revenue", explanation: "Revenue belongs under Income Statement → Revenue." },
  { id: "li2", label: "Wage Expense", amount: 2000, bucket: "IS:Expense", explanation: "Wages belong under Income Statement → Expenses." },
  { id: "li3", label: "Rent Expense", amount: 900, bucket: "IS:Expense", explanation: "Rent is an Income Statement expense." },
  { id: "li4", label: "Depreciation Expense", amount: 600, bucket: "IS:Expense", explanation: "Depreciation is an Income Statement expense." },

  { id: "li5", label: "Equipment", amount: 12000, bucket: "BS:Asset", explanation: "Equipment is a Balance Sheet asset." },
  { id: "li6", label: "Inventory", amount: 4000, bucket: "BS:Asset", explanation: "Inventory is a Balance Sheet asset." },
  { id: "li7", label: "Accounts Payable", amount: 4000, bucket: "BS:Liability", explanation: "Accounts Payable is a Balance Sheet liability." },
  { id: "li8", label: "Unearned Revenue", amount: 3000, bucket: "BS:Liability", explanation: "Unearned Revenue is a liability until earned." },
  { id: "li9", label: "Owner Contribution", amount: 20000, bucket: "BS:Equity", explanation: "Owner contributions increase equity." },

  { id: "li10", label: "Cash collected from customers", amount: 1200, bucket: "CF:Operating", explanation: "Collections from customers are Operating cash inflows." },
  { id: "li11", label: "Cash paid for wages", amount: -2000, bucket: "CF:Operating", explanation: "Wages paid are Operating cash outflows." },
  { id: "li12", label: "Cash paid for rent", amount: -900, bucket: "CF:Operating", explanation: "Rent paid is Operating cash outflow." },
  { id: "li13", label: "Purchase of equipment (cash)", amount: -12000, bucket: "CF:Investing", explanation: "Buying equipment is an Investing cash outflow." },
  { id: "li14", label: "Owner cash contribution", amount: 20000, bucket: "CF:Financing", explanation: "Owner contribution is a Financing cash inflow." },
  { id: "li15", label: "Dividends paid", amount: -500, bucket: "CF:Financing", explanation: "Dividends paid are Financing cash outflows." },
];

// ---------- State ----------
const state = {
  round: 0,              // 1 or 2
  txIndex: 0,
  score: 0,
  review: [],
  selectedLineItemId: null,
  remainingLineItems: [],
  placedByBucket: {},    // bucket -> [item]
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

const progressBar = document.getElementById("progressBar");

const round1Area = document.getElementById("round1Area");
const txCountBadge = document.getElementById("txCountBadge");
const txAmount = document.getElementById("txAmount");
const questionText = document.getElementById("questionText");

const round2Area = document.getElementById("round2Area");
const itemsList = document.getElementById("itemsList");
const selectedItemBanner = document.getElementById("selectedItemBanner");

const finalScoreText = document.getElementById("finalScoreText");
const reviewArea = document.getElementById("reviewArea");

const totRevenue = document.getElementById("totRevenue");
const totExpenses = document.getElementById("totExpenses");
const totNetIncome = document.getElementById("totNetIncome");
const totOpCF = document.getElementById("totOpCF");
const totInvCF = document.getElementById("totInvCF");
const totFinCF = document.getElementById("totFinCF");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModalBtn");

// Drop zone containers (for showing placed items)
const zoneMap = {
  "IS:Revenue": document.getElementById("dz-IS-Revenue"),
  "IS:Expense": document.getElementById("dz-IS-Expense"),
  "BS:Asset": document.getElementById("dz-BS-Asset"),
  "BS:Liability": document.getElementById("dz-BS-Liability"),
  "BS:Equity": document.getElementById("dz-BS-Equity"),
  "CF:Operating": document.getElementById("dz-CF-Operating"),
  "CF:Investing": document.getElementById("dz-CF-Investing"),
  "CF:Financing": document.getElementById("dz-CF-Financing"),
};

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

function updateScore() { scoreText.textContent = String(state.score); }

function resetGame() {
  state.round = 1;
  state.txIndex = 0;
  state.score = 0;
  state.review = [];
  state.selectedLineItemId = null;
  state.remainingLineItems = [...lineItems];
  state.placedByBucket = {};

  Object.values(zoneMap).forEach(z => { if (z) z.innerHTML = ""; });

  hide(selectedItemBanner);
  selectedItemBanner.textContent = "";

  updateScore();
  setProgress(0);
}

function setProgress(pct) {
  const clamped = Math.max(0, Math.min(100, pct));
  progressBar.style.width = `${clamped}%`;
}

function normalizeRound1Label(code) {
  if (code === "IS") return "Income Statement";
  if (code === "BS") return "Balance Sheet";
  if (code === "CF") return "Cash Flow Statement";
  return code;
}

// ---------- Round 1 ----------
function startRound1() {
  state.round = 1;
  roundLabel.textContent = "Round 1";
  progressText.textContent = "Step 1 of 2";
  show(round1Area);
  hide(round2Area);
  renderRound1();
}

function renderRound1() {
  const tx = transactions[state.txIndex];
  txCountBadge.textContent = `Transaction ${state.txIndex + 1} of ${transactions.length}`;
  txAmount.textContent = fmtMoney(tx.amount);
  questionText.textContent = tx.text;

  // Round 1 = 0% -> 50%
  const pct = Math.round((state.txIndex / transactions.length) * 50);
  setProgress(pct);
}

function handleRound1Answer(answer) {
  const tx = transactions[state.txIndex];
  const correct = tx.correct;

  const isCorrect = answer === correct;
  if (isCorrect) state.score += 1;

  state.review.push({
    type: "Round 1",
    prompt: `${tx.text} (${fmtMoney(tx.amount)})`,
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
  state.round = 2;
  roundLabel.textContent = "Round 2";
  progressText.textContent = "Step 2 of 2";
  hide(round1Area);
  show(round2Area);

  renderLineItems();
  updateSelectedBanner();
  setProgress(50);
}

function renderLineItems() {
  itemsList.innerHTML = "";

  const items = [...state.remainingLineItems].sort((a, b) => a.label.localeCompare(b.label));

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.dataset.itemId = item.id;

    const left = document.createElement("div");
    left.innerHTML = `<strong>${item.label}</strong><div class="muted small">${fmtMoney(item.amount)}</div>`;

    const right = document.createElement("div");
    right.className = "muted small";
    right.textContent = "Click";

    div.appendChild(left);
    div.appendChild(right);

    if (state.selectedLineItemId === item.id) div.classList.add("selected");

    div.addEventListener("click", () => {
      state.selectedLineItemId = item.id;
      renderLineItems();
      updateSelectedBanner();
    });

    itemsList.appendChild(div);
  });

  const total = lineItems.length;
  const placed = total - state.remainingLineItems.length;
  const pct = 50 + Math.round((placed / total) * 50);
  setProgress(pct);
}

function updateSelectedBanner() {
  if (!state.selectedLineItemId) {
    hide(selectedItemBanner);
    selectedItemBanner.textContent = "";
    return;
  }
  const item = state.remainingLineItems.find(x => x.id === state.selectedLineItemId);
  if (!item) return;

  selectedItemBanner.textContent = `Selected: ${item.label} (${fmtMoney(item.amount)}) — now click the matching section on the statements.`;
  show(selectedItemBanner);
}

function renderPlacedItem(bucket, item) {
  const container = zoneMap[bucket];
  if (!container) return;

  const wrap = document.createElement("div");
  wrap.className = "placed";

  const name = document.createElement("div");
  name.textContent = item.label;

  const amt = document.createElement("div");
  amt.textContent = fmtMoney(item.amount);

  wrap.appendChild(name);
  wrap.appendChild(amt);

  container.appendChild(wrap);
}

function handleBucketClick(bucket) {
  if (!state.selectedLineItemId) {
    openModal("Select an item first.", "Click a line item on the left, then click the statement section where it belongs.");
    return;
  }

  const item = state.remainingLineItems.find(x => x.id === state.selectedLineItemId);
  if (!item) return;

  const isCorrect = bucket === item.bucket;
  if (isCorrect) state.score += 1;
  updateScore();

  state.review.push({
    type: "Round 2",
    prompt: `Place: ${item.label} (${fmtMoney(item.amount)})`,
    yourAnswer: bucket,
    correctAnswer: item.bucket,
    explanation: item.explanation,
    isCorrect
  });

  if (!isCorrect) {
    openModal("Not quite.", item.explanation);
    return;
  }

  state.placedByBucket[bucket] = state.placedByBucket[bucket] || [];
  state.placedByBucket[bucket].push(item);
  renderPlacedItem(bucket, item);

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
function sumBucket(bucket) {
  const arr = state.placedByBucket[bucket] || [];
  return arr.reduce((acc, x) => acc + x.amount, 0);
}

function showResults() {
  showScreen("results");
  finalScoreText.textContent = String(state.score);

  const rev = sumBucket("IS:Revenue");
  const exp = sumBucket("IS:Expense");
  const net = rev - exp;

  const op = sumBucket("CF:Operating");
  const inv = sumBucket("CF:Investing");
  const fin = sumBucket("CF:Financing");

  totRevenue.textContent = fmtMoney(rev);
  totExpenses.textContent = fmtMoney(exp);
  totNetIncome.textContent = fmtMoney(net);

  totOpCF.textContent = fmtMoney(op);
  totInvCF.textContent = fmtMoney(inv);
  totFinCF.textContent = fmtMoney(fin);

  reviewArea.innerHTML = "";
  state.review.forEach(r => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div>
        <strong>${r.type}</strong><br/>
        ${r.prompt}<br/>
        <span class="muted">Your answer:</span> ${r.yourAnswer} |
        <span class="muted">Correct:</span> ${r.correctAnswer}<br/>
        <span class="muted">Why:</span> ${r.explanation}
      </div>
      <div class="muted small">${r.isCorrect ? "✅" : "❌"}</div>
    `;
    reviewArea.appendChild(div);
  });

  setProgress(100);
}

// ---------- Events ----------
startBtn.addEventListener("click", () => {
  resetGame();
  showScreen("game");
  startRound1();
});

restartBtn.addEventListener("click", () => {
  resetGame();
  showScreen("start");
});

closeModalBtn.addEventListener("click", () => {
  closeModal();
});

// Round 1: statement panel clicks
document.querySelectorAll("[data-round1]").forEach(btn => {
  btn.addEventListener("click", () => {
    handleRound1Answer(btn.dataset.round1);
  });
});

// Round 2: statement section clicks
document.querySelectorAll(".dropZone").forEach(btn => {
  btn.addEventListener("click", () => {
    handleBucketClick(btn.dataset.bucket);
  });
});

// Initialize
showScreen("start");
hide(modalOverlay);
