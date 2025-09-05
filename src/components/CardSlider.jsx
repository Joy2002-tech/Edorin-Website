import React, {useRef} from "react";

export default function CardSlider({cards = [], highlightIndex = -1}){
  const ref = useRef();

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{scrollSnapType: "x mandatory"}}
      >
        {cards.map((c, i) => (
          <div key={i} className={`min-w-[220px] bg-white rounded-xl p-4 shadow-sm flex-shrink-0 ${i===highlightIndex ? "border-2 border-accent" : ""}`} style={{scrollSnapAlign: "start"}}>
            {i === highlightIndex && <div className="text-xs uppercase text-accent font-bold mb-2">New</div>}
            <h4 className="font-semibold">{c.title}</h4>
            <p className="text-sm text-gray-600 mt-2">{c.desc}</p>
            <div className="mt-4">
              <button className="px-3 py-1 rounded border text-sm">Open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
