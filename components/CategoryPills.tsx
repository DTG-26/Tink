'use client';

import React from 'react';
import { Category } from '../types/database';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  productCounts?: Record<string, number>;
  totalProductsCount: number;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  productCounts,
  totalProductsCount
}) => {
  return (
    <nav
      aria-label="Categories"
      className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 py-2.5 px-4"
    >
      <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {/* 'All' Category Pill */}
        <button
          onClick={() => onSelectCategory(null)}
          id="category-pill-all"
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${selectedCategoryId === null
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
        >
          All
          <span
            className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${selectedCategoryId === null
                ? 'bg-blue-700 text-white'
                : 'bg-slate-200 text-slate-700'
              }`}
          >
            {totalProductsCount}
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const count = productCounts ? productCounts[cat.id] || 0 : undefined;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              id={`category-pill-${cat.id}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${isSelected
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              {cat.name}
              {typeof count === 'number' && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${isSelected
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-200 text-slate-700'
                    }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
