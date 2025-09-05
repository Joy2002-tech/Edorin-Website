import React from "react";
import Header from "./components/Header";
import BrandHero from "./components/BrandHero";
import ProductHero from "./components/ProductHero";
import CardSlider from "./components/CardSlider";
import Footer from "./components/Footer";

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="max-w-6xl mx-auto px-4">
        <BrandHero />
        <ProductHero />
        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Tools</h3>
          <CardSlider cards={sampleTools} />
        </section>

        <section className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Labs</h3>
          <CardSlider cards={sampleLabs} highlightIndex={0} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* sample data */
const sampleTools = [
  {title: "VWAP Scanner", desc: "Intraday VWAP breakouts"},
  {title: "Option Flow", desc: "Watch option interest"},
  {title: "Backtester", desc: "Replay historic days"},
  {title: "Alerts", desc: "Customize alerts"}
];

const sampleLabs = [
  {title: "New: AI Filter", desc: "Experimental model"},
  {title: "Heatmap", desc: "Sector heat"},
  {title: "Algo Builder", desc: "Drag & drop rules"}
];
