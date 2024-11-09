"use client"

import {ProductData, BaremList, SelectableAttribute} from "@/types/models";
import { useState } from "react";

const ProductInfo:React.FC<{data: ProductData}> = ({data}) => {
  const {productTitle, baremList, selectableAttributes} = data;

  const allPrices = baremList.map((item: BaremList) => item.price);
  const maxPrice: number = Math.max(...allPrices);
  const minPrice: number = Math.min(...allPrices);

  const maxQuantity: number = Math.max(...baremList.map((item: BaremList) => item.maximumQuantity));
  const minQuantity: number = Math.min(...baremList.map((item: BaremList) => item.minimumQuantity));

  const [quantity, setQuantity] = useState<number | null>(minQuantity);
  // delete this log later
  console.log(quantity)

  const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    if(newQuantity < minQuantity){
      e.target.value = minQuantity.toString();
      setQuantity(minQuantity);
      return
    } else if (newQuantity > maxQuantity){
      e.target.value = maxQuantity.toString();
      setQuantity(maxQuantity);
      return
    }
    setQuantity(Number(e.target.value));
  };

  return (
    <div className='flex flex-col w-3/5 h-[850px] gap-2 py-4'>
      <h1 className='text-2xl md:text-4xl font-bold px-4'>{productTitle}</h1>

      <p className='text-2xl md:text-3xl font-bold mt-6 px-4'>
        {minPrice} TL - {maxPrice} TL
        <span className='text-xl md:text-2xl text-gray-500 font-normal'>/ Adet</span>
      </p>
      <p className='text-xl md:text-2xl text-gray-500 px-4'>{minQuantity} Adet (Minimum Sipariş Adedi)</p>

      {selectableAttributes && selectableAttributes?.length > 0 && selectableAttributes.map((item: SelectableAttribute, index) => (
        <div className="flex flex-row gap-8 mt-6 px-4" key={index}>
          <div className="flex justify-between">
            <p className="w-[180px] text-xl">{item.name}</p>
            <p className="text-xl">:</p>
          </div>
          <div className="grid grid-cols-3 w-full gap-4 text-center">{item.values.map((value: string, index) => (
            <p className="text-xl p-2 border-2 border-grey-200 rounded" key={index}>{value}</p>
          ))}</div>
        </div>
      ))}

      <div className="flex flex-col bg-slate-200 gap-8 p-4 mt-6">
        <div className="flex gap-8 ">
          <div className="flex justify-between">
            <p className="w-[180px] text-xl">Toptan Fiyat <br /> (Adet)</p>
            <p className="text-xl text-center">:</p>
          </div>

          <div className="grid grid-cols-4 w-full gap-4 text-center">
            {baremList.map((item: BaremList, index) => (
              <div className={`flex flex-col text-xl ${(index + 1) % 4 === 0 ? '' : 'border-r-2'} border-gray-400`} key={index}>
                <p>{item.minimumQuantity} {item.maximumQuantity === maxQuantity ? ` +` : `- ${item.maximumQuantity}`}</p>
                <p>{item.price} TL</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex text-xl">
            <label htmlFor="quantityInput" className="text-xl w-[180px]">Adet</label>
            <p className="text-xl text-center">:</p>
          </div>
          <input
              className="text-xl text-center w-[100px] ml-8 p-2
              [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none 
              [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              id="quantityInput"
              type="number"
              defaultValue={minQuantity}
              onChange={() => setQuantity(null)}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => onQuantityChange(e)}

              
            />
          <p className="text-xl ml-4" >Adet</p>

          <p className="text-xl ml-auto text-green-500 bg-slate-100 p-1" >Stok Adeti: {maxQuantity}</p>
        </div>
      </div>

      <div className="flex text-2xl font-bold px-4 items-center mt-4">
        <p className="w-[180px]">Toplam</p>
        <p className="text-center">:</p>
        <p className="text-3xl ml-8"> - </p>
      </div>

      <div className="flex ml-[235px] mt-8" >
        <button className="bg-orange-300 text-white text-2xl font-bold rounded hover:bg-orange-400 p-6 w-[300px]">
          SEPETE EKLE
        </button>
      </div>

    </div>
  );
};

export default ProductInfo;