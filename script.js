// Fill footer year
document.getElementById('yr').textContent = new Date().getFullYear();

// Ticker items (sample) - replace with live feed later
const tickerItems = [
  "NIFTY 50 +0.32% 21,432",
  "BANKNIFTY -0.10% 44,212",
  "TCS +1.22% 3,675",
  "RELIANCE -0.40% 2,325",
  "HDFCBANK +0.12% 1,567"
];

function buildTicker() {
  const track = document.getElementById('ticker-track');
  const items = tickerItems.concat(tickerItems); // duplicate for scrolling
  track.innerHTML = items.map(t => `<span>${t}</span>`).join('');
}

window.onload = buildTicker;
