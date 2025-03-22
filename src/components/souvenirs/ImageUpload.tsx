
import React from 'react';
import { Camera, X } from 'lucide-react';

interface ImageUploadProps {
  imageUrls: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  imageUrls, 
  handleImageChange, 
  removeImage 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Photos</h2>
        <label className="flex items-center gap-1 text-sm font-medium cursor-pointer text-primary">
          <Camera className="h-4 w-4" />
          <span>Add Photo</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </label>
      </div>
      
      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={url}
                alt={`Souvenir ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Camera className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Add photos of your souvenir</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
