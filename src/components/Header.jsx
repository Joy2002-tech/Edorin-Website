import React from "react";
import Ticker from "./Ticker";

export default function Header(){
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center text-white font-bold">JD</div>
          <div>
            <div className="font-bold">YourBrand</div>
            <div className="text-xs text-gray-500">Trading tools & labs</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="hover:text-accent" href="#tools">Tools</a>
          <a className="hover:text-accent" href="#labs">Labs</a>
          <a className="hover:text-accent" href="#about">About</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="text-sm px-4 py-1 border rounded">Login</button>
        </div>
      </div>

      {/* ticker track */}
      <div className="border-t">
        <Ticker />
      </div>
    </header>
  );
}
