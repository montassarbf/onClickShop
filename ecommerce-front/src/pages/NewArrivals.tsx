import React from "react";

const NewArrivals: React.FC = () => {
  return (
    <section id="new" className="min-h-[40vh] bg-white px-6 py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-block px-4 py-1 text-sm font-medium text-orange-600 bg-orange-50 rounded-full mb-4">
          Just dropped
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          New <span className="text-orange-400">Arrivals</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Fresh styles and limited drops are added to the shop regularly. Scroll up to browse the full catalog or jump straight to the shop.
        </p>
        <button
          type="button"
          className="btn bg-orange-500 hover:bg-orange-600 text-white border-0 rounded-full px-8"
          onClick={() => document.getElementById("Shop")?.scrollIntoView({ behavior: "smooth" })}
        >
          Browse the shop
        </button>
      </div>
    </section>
  );
};

export default NewArrivals;
