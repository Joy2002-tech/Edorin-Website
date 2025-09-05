import React from "react";

export default function Footer(){
  return (
    <footer className="mt-16 bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="font-bold text-lg">YourBrand</div>
          <div className="text-sm text-gray-600 mt-2">Trusted tools for traders</div>
        </div>

        <div>
          <div className="font-semibold">Product</div>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>Tools</li>
            <li>Labs</li>
            <li>Docs</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">Contact</div>
          <div className="text-sm text-gray-600 mt-2">hi@yourbrand.com</div>
        </div>
      </div>
    </footer>
  );
}
