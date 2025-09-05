import React from "react";

export default function ProductHero(){
  return (
    <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold">Hero Product 1</h2>
        <p className="mt-2 text-gray-600">Primary product description. This is where your main product copy goes.</p>
        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 rounded bg-accent text-white">Open</button>
          <button className="px-4 py-2 rounded border">Docs</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold">Hero Product 2</h2>
        <p className="mt-2 text-gray-600">Secondary product or feature. Quick summary to educate users.</p>
        <div className="mt-4">
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Real-time signals</li>
            <li>• Paper trading</li>
            <li>• Quick backtests</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
