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
    <div className='flex flex-col w-2/5 items-center p-4' >
      <div className="w-[600px] h-[600px]">
        {displayPhoto && <Image 
          src={displayPhoto} 
          alt="Displayed Photo" 
          width={800} 
          height={400} 
          className="w-full h-full object-contain"
          priority={true}
        />}
      </div>

      <div className="grid grid-cols-4 w-full gap-4 mt-8">
        {photoList && photoList.map((photo: string, index: number) => (
          <div className={`w-[160px] h-[160px] border-2 border-gray-300 hover:cursor-pointer ${photo === displayPhoto && "border-4 border-slate-600"}`}
          key={index}
          onClick={() => showInDisplay(photo)}
          >
            <Image 
            src={photo} 
            alt={`Thumbnail ${index + 1}`}
            width={800} 
            height={400} 
            className="w-full h-full object-contain" 
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductPhotos;