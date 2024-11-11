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
    <div className="flex flex-row w-full h-full items-start md:items-center justify-items-center min-h-screen font-sans bg-gray-100">
      <main className="flex flex-col md:flex-row w-full h-full lg:w-10/12 mx-auto px-8 py-4 bg-white border-1 border-gray-400 rounded shadow-md">
        <Suspense>
          <ProductPhotos data = {productData} selectedVariant = {selectedVariant}/>
          <ProductInfo data = {productData} selectedVariant = {selectedVariant} setSelectedVariant = {setSelectedVariant}/>
        </Suspense>
      </main>
    </div>
  );
}