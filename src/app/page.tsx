"use client"

import productData from '@/data/product-data.json';
import ProductInfo from './components/ProductInfo';
import { useState } from 'react';
import { ProductVariant } from '@/types/models';
import { Suspense } from 'react'
import ProductPhotos from './components/ProductPhotos';

export default function Home() {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  return (
    <div className="flex flex-row w-full h-full items-center justify-items-center min-h-screen p-2 md:p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-row w-full h-full">
        <Suspense>
          <ProductPhotos data = {productData} selectedVariant = {selectedVariant}/>
          <ProductInfo data = {productData} selectedVariant = {selectedVariant} setSelectedVariant = {setSelectedVariant}/>
        </Suspense>
      </main>
    </div>
  );
}