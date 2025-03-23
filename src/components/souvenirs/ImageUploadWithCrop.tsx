
import React from 'react';
import { Camera, Pencil, X } from 'lucide-react';
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
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  console.error(`Failed to load image at index ${index}`);
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjJDMTcuNTIyOCAyMiAyMiAxNy41MjI4IDIyIDEyQzIyIDYuNDc3MTUgMTcuNTIyOCAyIDEyIDJDNi40NzcxNSAyIDIgNi40NzcxNSAyIDEyQzIgMTcuNTIyOCA2LjQ3NzE1IDIyIDEyIDIyWiIgc3Ryb2tlPSIjQTFBMUFBIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIgMTJIMjIiIHN0cm9rZT0iI0ExQTFBQSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xMiAyQzE0Ljk1IDIgMTcuNDggNi40NyAxNy40OCAxMkMxNy40OCAxNy41MyAxNC45NSAyMiAxMiAyMkM5LjA1IDIyIDYuNTIgMTcuNTMgNi41MiAxMkM2LjUyIDYuNDcgOS4wNSAyIDEyIDJaIiBzdHJva2U9IiNBMUExQUEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=';
                }}
              />
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
      {imageToEdit && (
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
