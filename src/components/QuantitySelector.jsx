import React from "react";
import { Plus, Minus } from "lucide-react";

export default function QuantitySelector({ quantity, onChange, min = 1, max = 100, isRTL }) {
  const handleDecrement = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className="flex items-center justify-between">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
        {isRTL ? "الكمية *" : "Quantity *"}
      </label>
      <div className="flex items-center border border-gray-200 dark:border-[#26313D] bg-[#F3F4F6] dark:bg-[#151C24] rounded-xl p-1">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= min}
          className="w-8 h-8 rounded-lg bg-white dark:bg-[#1C2530] text-gray-800 dark:text-white flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#253140] disabled:opacity-40 transition-colors shadow-sm"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-10 text-center font-bold text-sm text-gray-900 dark:text-white">
          {quantity}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={quantity >= max}
          className="w-8 h-8 rounded-lg bg-white dark:bg-[#1C2530] text-gray-800 dark:text-white flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#253140] disabled:opacity-40 transition-colors shadow-sm"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
