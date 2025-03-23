
import React from 'react';
import { Camera, Pencil, X, ImageIcon } from 'lucide-react';
import ImageCropper from '../common/ImageCropper';

interface ImageUploadWithCropProps {
  imageUrls: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  showCropper: boolean;
  imageToEdit: string | null;
  onCropCancel: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
  onEditImage: (index: number) => void;
}

const ImageUploadWithCrop: React.FC<ImageUploadWithCropProps> = ({ 
  imageUrls, 
  handleImageChange, 
  removeImage,
  showCropper,
  imageToEdit,
  onCropCancel,
  onCropComplete,
  onEditImage
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
            onChange={handleImageChange}
          />
        </label>
      </div>
      
      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
              <div className="w-full h-full relative">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error(`Failed to load image at index ${index}`, url);
                    const target = e.target as HTMLImageElement;
                    // Replace with a placeholder icon
                    target.style.display = 'none';
                    const parent = target.parentNode as HTMLElement;
                    if (parent) {
                      parent.classList.add('flex', 'items-center', 'justify-center');
                      const placeholder = document.createElement('div');
                      placeholder.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;
                      placeholder.className = 'flex items-center justify-center w-full h-full';
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onEditImage(index)}
                  className="p-1.5 rounded-full bg-white/90 text-black mr-2"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 rounded-full bg-white/90 text-black"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Camera className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Add photos and crop them perfectly</p>
        </div>
      )}

      {/* Image Cropper Dialog */}
      {showCropper && imageToEdit && (
        <ImageCropper
          imageUrl={imageToEdit}
          onCropComplete={onCropComplete}
          onCancel={onCropCancel}
          open={showCropper}
        />
      )}
    </div>
  );
};

export default ImageUploadWithCrop;
