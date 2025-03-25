
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';

interface EditSouvenirDialogProps {
  name: string;
  notes: string;
  categories: string[];
  isOpen: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, notes: string, categories: string[]) => void;
}

const EditSouvenirDialog: React.FC<EditSouvenirDialogProps> = ({
  name: initialName,
  notes: initialNotes,
  categories: initialCategories,
  isOpen,
  isSubmitting,
  onOpenChange,
  onSave
}) => {
  const [editName, setEditName] = useState(initialName);
  const [editNotes, setEditNotes] = useState(initialNotes || '');
  const [editCategories, setEditCategories] = useState<string[]>([...initialCategories]);
  
  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setEditName(initialName);
      setEditNotes(initialNotes || '');
      setEditCategories([...initialCategories]);
    }
  }, [isOpen, initialName, initialNotes, initialCategories]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editName, editNotes, editCategories);
  };
  
  const handleCategoryToggle = (category: string) => {
    setEditCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Available categories
  const allCategories = [
    'Handcrafted', 'Food', 'Clothing', 'Art', 'Jewelry', 
    'Antique', 'Technology', 'Book', 'Toy', 'Decoration', 'Other'
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Souvenir</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="edit-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Souvenir name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    editCategories.includes(category)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="edit-notes" className="block text-sm font-medium">
              Notes
            </label>
            <textarea
              id="edit-notes"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-md min-h-[100px]"
              placeholder="Any special memories or details?"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !editName.trim()}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSouvenirDialog;
