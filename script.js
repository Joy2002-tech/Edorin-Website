// Simple site script: injects ticker items and slider cards, adds "New" tag
const tickerItems = [
  "NIFTY 50 +0.32% 21,432",
  "BANKNIFTY -0.10% 44,212",
  "TCS +1.22% 3,675",
  "RELIANCE -0.40% 2,325",
  "HDFCBANK +0.12% 1,567"
];

function buildTicker(){
  const track = document.getElementById('ticker-track');
  // duplicate the array so the CSS scroll appears continuous
  const items = tickerItems.concat(tickerItems);
  track.innerHTML = items.map(t => `<span>${t}</span>`).join('');
}

// tools & labs sample content
const tools = [
  {title:"VWAP Scanner", desc:"Intraday VWAP breakouts"},
  {title:"Option Flow", desc:"Watch option interest"},
  {title:"Backtester", desc:"Replay historic days"},
  {title:"Alerts", desc:"Customize alerts"}
];

const labs = [
  {title:"AI Filter", desc:"Experimental model"},
  {title:"Heatmap", desc:"Sector heat"},
  {title:"Algo Builder", desc:"Drag & drop rules"}
];

function buildCards(containerId, list, highlightIndex = -1){
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  list.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'card';
    const tag = (i === highlightIndex) ? `<div class="tag-new">New</div>` : '';
    div.innerHTML = `
      ${tag}
      <h4 style="margin:0 0 6px 0">${c.title}</h4>
      <div style="color:#6b7280;font-size:14px">${c.desc}</div>
      <div style="margin-top:10px">
        <button style="padding:6px 10px;border-radius:8px;border:1px solid #e6edf3">Open</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// init
document.addEventListener('DOMContentLoaded', () => {
  buildTicker();
  buildCards('tools-slider', tools);
  buildCards('labs-slider', labs, 0);
});
