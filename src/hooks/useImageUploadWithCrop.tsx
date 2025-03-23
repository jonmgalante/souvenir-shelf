
import { useState } from 'react';

interface UseImageUploadWithCropReturn {
  imageUrls: string[];
  imageFiles: File[];
  images: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  showCropper: boolean;
  setShowCropper: (show: boolean) => void;
  imageToEdit: string | null;
  setImageToEdit: (image: string | null) => void;
  currentEditIndex: number | null;
  setCurrentEditIndex: (index: number | null) => void;
  handleCropComplete: (croppedImageUrl: string) => void;
}

export const useImageUploadWithCrop = (): UseImageUploadWithCropReturn => {
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    console.log("Image file selected:", files[0].name);
    
    // Get the first file for immediate editing
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    
    // Set up for cropping
    setImageToEdit(imageUrl);
    setCurrentEditIndex(null); // Indicates this is a new upload
    setShowCropper(true);
  };
  
  const handleCropComplete = async (croppedImageUrl: string) => {
    try {
      console.log("Crop completed, processing image...");
      
      // If we're editing an existing image
      if (currentEditIndex !== null) {
        // Update existing image
        const newImageUrls = [...imageUrls];
        newImageUrls[currentEditIndex] = croppedImageUrl;
        setImageUrls(newImageUrls);
        
        // Convert blob URL to File
        const response = await fetch(croppedImageUrl);
        const blob = await response.blob();
        const croppedFile = new File([blob], `cropped-image-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        // Update data URL for persistence
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          const newImages = [...images];
          newImages[currentEditIndex] = dataUrl;
          setImages(newImages);
          
          // Update file array
          const newImageFiles = [...imageFiles];
          newImageFiles[currentEditIndex] = croppedFile;
          setImageFiles(newImageFiles);
        };
        
        reader.readAsDataURL(croppedFile);
      } else {
        // Add new image
        console.log("Adding new cropped image");
        setImageUrls(prev => [...prev, croppedImageUrl]);
        
        // Convert blob URL to File
        const response = await fetch(croppedImageUrl);
        const blob = await response.blob();
        const croppedFile = new File([blob], `cropped-image-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setImageFiles(prev => [...prev, croppedFile]);
        
        // Store as data URL for persistence
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          setImages(prev => [...prev, dataUrl]);
        };
        reader.readAsDataURL(croppedFile);
      }
      
      // Reset cropping state
      setShowCropper(false);
      setImageToEdit(null);
      setCurrentEditIndex(null);
      
    } catch (error) {
      console.error('Error processing cropped image:', error);
      setShowCropper(false);
    }
  };
  
  const removeImage = (index: number) => {
    console.log("Removing image at index:", index);
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  return {
    imageUrls,
    imageFiles,
    images,
    handleImageChange,
    removeImage,
    showCropper,
    setShowCropper,
    imageToEdit,
    setImageToEdit,
    currentEditIndex,
    setCurrentEditIndex,
    handleCropComplete
  };
};
