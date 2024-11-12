import { ProductData, ProductVariant } from "@/types/models"
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const ProductPhotos:React.FC<{data: ProductData, selectedVariant: ProductVariant | null}> = ({data, selectedVariant}) => {
  const [photoList, setPhotoList] = useState<string[] | null>(null);
  const [displayPhoto, setDisplayPhoto] = useState<string | null>(null);
  const allPhotos = [...new Set(data.productVariants.map(item => item.images).flat())];

  useEffect(() => {
    if(selectedVariant){
        setPhotoList(selectedVariant.images);
        setDisplayPhoto(selectedVariant.images[0]);
    } else {
      setPhotoList(allPhotos);
      setDisplayPhoto(allPhotos[0]);
    }
  }, [selectedVariant]);

  const showInDisplay = (src: string) => {
    setDisplayPhoto(src);
  }

  const loadingSpinner = () => (
    <div className="w-[100px] h-[100px] lg:w-[150px] lg:h-[150px] border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin m-auto mt-[100px] lg:mt-[150px]"></div>
  );

  const displayArea = useMemo(() => (
    <div className="w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] mt-6 md:mt-0">
      {displayPhoto ? (
        <Image
        src={displayPhoto}
        alt="Displayed Photo"
        width={600}
        height={600}
        className="w-full h-full object-contain"
        priority={true}
      />
      ):(
        loadingSpinner()
      )}
    </div>
  ), [displayPhoto]);

  const thumbnailArea = useMemo(() => (
    <div className="flex overflow-x-auto w-full mb-5 md:mb-16 mx-auto mt-6 md:mt-16 lg:mt-0 space-x-[9px] md:space-x-[11px] lg:space-x-[30px]">
      {photoList && photoList.map((photo: string, index: number) => (
        <div className={`min-w-[70px] min-h-[70px] md:min-w-[60px] md:min-h-[60px] lg:min-w-[120px] lg:min-h-[120px] border-2 border-gray-300 hover:cursor-pointer mx-auto ${photo === displayPhoto && "md:border-4 border-gray-600"}`}
          key={index}
          onClick={() => showInDisplay(photo)}
        >
          <Image
            src={photo}
            alt={`Thumbnail ${index + 1}`}
            width={160}
            height={160}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  ), [photoList, displayPhoto]);

  return (
    <div className='flex flex-col w-full md:w-2/5 items-center justify-between md:justify-start lg:justify-between p-0 lg:p-4 min-h-[438px]' >
      {displayArea}
      {thumbnailArea}      
    </div>
  )
}

export default ProductPhotos;