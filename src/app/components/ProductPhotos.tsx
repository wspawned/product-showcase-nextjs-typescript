import { ProductData, ProductVariant } from "@/types/models"
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

const ProductPhotos:React.FC<{data: ProductData, selectedVariant: ProductVariant | null}> = ({data, selectedVariant}) => {
  const [photoList, setPhotoList] = useState<string[] | null>(null);
  const [displayPhoto, setDisplayPhoto] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    if(params.size === data.selectableAttributes.length || selectedVariant){
      if(selectedVariant){
        setPhotoList(selectedVariant.images);
        setDisplayPhoto(selectedVariant.images[0]);
      }
    } else {
      setPhotoList(data.productVariants[0].images);
      setDisplayPhoto(data.productVariants[0].images[0]);
    }
  }, [selectedVariant, searchParams]);

  const showInDisplay = (src: string) => {
    setDisplayPhoto(src);
  }

  return (
    <div className='flex flex-col w-full md:w-2/5 items-center justify-between md:justify-start lg:justify-between p-0 lg:p-4 min-h-[438px]' >
      <div className="w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] mt-6 md:mt-0">
        {displayPhoto && <Image 
          src={displayPhoto} 
          alt="Displayed Photo" 
          width={600} 
          height={600} 
          className="w-full h-full object-contain"
          priority={true}
        />}
      </div>

      <div className="grid grid-cols-4 w-full mb-5 md:mb-16 mx-auto mt-6 md:mt-16 lg:mt-0">
        {photoList && photoList.map((photo: string, index: number) => (
          <div className={`w-[70px] h-[70px] md:w-[60px] md:h-[60px] lg:w-[120px] lg:h-[120px] border-2 border-gray-300 hover:cursor-pointer mx-auto ${photo === displayPhoto && "md:border-4 border-gray-600"}`}
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
    </div>
  )
}

export default ProductPhotos;