'use client';

import React, { useState } from 'react';
import { Category } from '../../types/database';
import { Plus, Trash2, FolderPlus } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onDeleteCategory
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddCategory(newCatName.trim());
      setNewCatName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Add Category Form */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <FolderPlus className="w-4 h-4 text-blue-600" />
          <span>Create New Category</span>
        </h3>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            required
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Grills & Barbecue, Drinks, Pastries"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newCatName.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Existing Categories List */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Categories ({categories.length})
          </h3>
        </div>

        {categories.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No categories created yet. Items will appear under &quot;All&quot;.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">
                    {cat.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteCategory(cat.id)}
                  className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
