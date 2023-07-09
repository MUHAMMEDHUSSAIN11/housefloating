import React, { useCallback } from 'react';
import { storage } from '@/app/firebase/clientApp';
import { TbPhotoPlus } from 'react-icons/tb';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {


  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const storageRef = ref(storage, 'Images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.error('Error uploading image:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);
        onChange(downloadURL);
      }
    );
  }, [onChange]);
  

  return (
    <div
      className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
      onClick={() => {
        // Open file input when the container is clicked
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
          fileInput.click();
        }
      }}>
      <input id="file-input" type="file" onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
      <TbPhotoPlus size={50} />
      <div className="font-semibold text-lg">Click to upload</div>
      {value && (
              <div className="
              absolute inset-0 w-full h-full">
                <Image
                  fill 
                  style={{ objectFit: 'cover' }} 
                  src={value} 
                  alt="House Boat" 
                />
              </div>
            )}
    </div>
  );
};

export default ImageUpload;
