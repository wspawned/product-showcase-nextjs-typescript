import productData from '@/data/product-data.json';
import ProductInfo from './components/ProductInfo';

export default function Home() {
  return (
    <div className="flex flex-row w-full h-full items-center justify-items-center min-h-screen p-2 md:p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-row w-full h-full">        
        <div className='flex flex-col w-2/5 bg-red-400 ' >
          PRODUCT PHOTOS
        </div>
        <ProductInfo data = {productData}/>
      </main>
    </div>
  );
}
