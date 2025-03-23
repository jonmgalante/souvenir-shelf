
import { useState } from 'react';

interface UseImageUploadReturn {
  imageUrls: string[];
  imageFiles: File[];
  images: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Process each file
    Array.from(files).forEach(file => {
      // Store the actual files for later upload
      setImageFiles(prev => [...prev, file]);
      
      // Create URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImageUrls(prev => [...prev, imageUrl]);
      
      // Store the file name or other persistent identifier instead of blob URL
      // For now we'll use a data URL which is more persistent than blob URLs
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImages(prev => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  return {
    imageUrls,
    imageFiles,
    images,
    handleImageChange,
    removeImage
  };
};
