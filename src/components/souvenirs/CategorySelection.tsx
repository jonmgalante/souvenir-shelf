
import React from 'react';
import { Check } from 'lucide-react';

interface CategorySelectionProps {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
  selectedCategories,
  toggleCategory
}) => {
  const categories = [
    'Artwork', 'Clothing', 'Jewelry', 'Handicraft',
    'Magnet', 'Food', 'Drink', 'Postcard', 'Map', 'Other'
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Categories</h2>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => toggleCategory(category)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
              selectedCategories.includes(category)
                ? 'bg-primary/10 border-primary/30'
                : 'bg-white border-gray-200'
            }`}
          >
            <span>{category}</span>
            {selectedCategories.includes(category) && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;
