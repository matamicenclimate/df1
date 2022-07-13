import { t } from 'i18next';
import { ChangeEvent } from 'react';

type ImageUploaderProps<T = unknown> = {
  selectedImage?: File | Blob | undefined | MediaSource;
  setSelectedImage?: React.Dispatch<React.SetStateAction<File | Blob | undefined | MediaSource>>;
  onChange?: (t: T) => void;
  value?: T;
};

export const ImageUploader = ({ selectedImage, setSelectedImage }: ImageUploaderProps) => {
  const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (setSelectedImage) {
        setSelectedImage(e.target.files[0]);
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col w-[720px] h-60 border-2 border-dashed border-climate-border rounded-xl">
          <div className="relative flex flex-col items-center justify-center">
            {selectedImage ? (
              <div>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  className="w-[440px] h-56 object-contain"
                  alt="Thumb"
                />
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center p-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="gray"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>

                <p className="pt-1 text-sm font-sanspro font-normal">
                  {t('Minter.uploadResources')}
                </p>
                <p className="text-sm text-climate-gray-artist">Max 50 mb</p>
              </div>
            )}
            <input
              type="file"
              className="absolute w-full h-60 opacity-0 cursor-pointer top-1"
              onChange={(event) => imageChange(event)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
