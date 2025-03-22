
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
      
      // We'll use the same URLs as placeholders until proper image upload is implemented
      setImages(prev => [...prev, imageUrl]);
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
