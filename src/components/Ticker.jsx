import React from "react";

/* simple ticker: replace with real data later */
const items = [
  "NIFTY 50 +0.32% 21,432",
  "BANKNIFTY -0.10% 44,212",
  "TCS +1.22% 3,675",
  "RELIANCE -0.40% 2,325",
  "HDFCBANK +0.12% 1,567"
];

export default function Ticker(){
  return (
    <div className="overflow-hidden">
      <div className="whitespace-nowrap py-2">
        <div className="inline-block ticker-track">
          {items.concat(items).map((t, i) => (
            <span key={i} className="mx-6 inline-block text-sm text-gray-600">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
