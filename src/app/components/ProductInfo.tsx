import {ProductData, BaremList, SelectableAttribute, ProductInfoSelectables, ProductVariant, Attribute} from "@/types/models";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import formatPrice from "../hooks/formatPrice";
import getBaremPrice from "../hooks/getBaremPrice";
import Button from "./Button";
import { IoMdStar } from "react-icons/io";
import { MdOutlineLocalShipping } from "react-icons/md";
import Modal from "./Modal";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const ProductInfo:React.FC<{data: ProductData, selectedVariant: ProductVariant | null, setSelectedVariant: React.Dispatch<React.SetStateAction<ProductVariant | null>>}> = (
  {data, selectedVariant, setSelectedVariant}
) => {
  const {productTitle, baremList, selectableAttributes, productVariants } = data;

  const allPrices = baremList.map((item: BaremList) => item.price);
  const maxPrice: number = Math.max(...allPrices);
  const minPrice: number = Math.min(...allPrices);

  const maxQuantity: number = Math.max(...baremList.map((item: BaremList) => item.maximumQuantity));
  const minQuantity: number = Math.min(...baremList.map((item: BaremList) => item.minimumQuantity));

  const [quantity, setQuantity] = useState<number | null>(minQuantity);
  const [totalPrice, setTotalPrice] = useState<string>(formatPrice(minQuantity*(getBaremPrice(minQuantity, baremList) ?? 0)));

  const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    if(newQuantity < minQuantity){
      e.target.value = minQuantity.toString();
      setQuantity(minQuantity);
      setTotalPrice(formatPrice(minQuantity*(getBaremPrice(minQuantity, baremList) ?? 0)));
      return
    } else if (newQuantity > maxQuantity){
      e.target.value = maxQuantity.toString();
      setQuantity(maxQuantity);
      setTotalPrice(formatPrice(maxQuantity*(getBaremPrice(maxQuantity, baremList) ?? 0)));
      return
    }
    setQuantity(newQuantity);
    setTotalPrice(formatPrice(newQuantity*(getBaremPrice(newQuantity, baremList) ?? 0)));
  };

  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectAttribute = (name:string, value:string) => {
    if(selectables[name] && !selectables[name].includes(value)){
      return
    }

    const params = new URLSearchParams(searchParams);
    if(params.get(name) === value){
      params.delete(name);
    } else {
      params.set(name, value);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const allSelectables: ProductInfoSelectables = Object.fromEntries(
    selectableAttributes.map(item => [item.name, item.values])
  );

  const [selectables, setSelectables] = useState<ProductInfoSelectables>(allSelectables);
  const [selectedValues, setSelectedValues] = useState<{[key: string]: string} | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const keys = Object.keys(allSelectables);

    if(params.size === 0){
      setSelectables(allSelectables);
      setSelectedValues(null);
      return
    }

    let newVariants: ProductVariant[] = [];
    const matchedKeys: string[] = [];
    const selectedAttribute: {[key: string]: string} = {};

    keys.forEach((key) => {
      const paramValue = params.get(key);
      if(paramValue !== null){
        selectedAttribute[key] = paramValue;
        matchedKeys.push(key);
        const variants = productVariants.filter((variant: ProductVariant) =>
          variant.attributes.some((item: Attribute) => item.name === key && item.value === paramValue)
        );

        if(newVariants.length === 0){
          newVariants = variants;
        } else {
          newVariants = newVariants.filter((value: ProductVariant) => variants.includes(value));
        }
      } else {
        delete selectedAttribute[key];
      }
    });

    const newSelectables: ProductInfoSelectables = {};
    newVariants.forEach((variant: ProductVariant) => {
      variant.attributes.forEach((attr: Attribute) => {
        if (!newSelectables[attr.name]) {
          newSelectables[attr.name] = [];
        }
        if (!newSelectables[attr.name].includes(attr.value)) {
          newSelectables[attr.name].push(attr.value);
        }
      });
    });

    if(matchedKeys.length === 1){
      newSelectables[matchedKeys[0]] = allSelectables[matchedKeys[0]];
    }
    setSelectables(newSelectables);
    setSelectedValues(selectedAttribute);

    if(params.size === selectableAttributes.length){
      const formattedSelectedAttributes = Object.entries(selectedAttribute).map(([key, value]) => ({
        name: key,
        value: value
      }));

      const newSelectedVariant = productVariants.find(variant => formattedSelectedAttributes.every(
        attr => variant.attributes.some(vAttr => vAttr.name === attr.name && vAttr.value === attr.value)
      )) || null;
      setSelectedVariant(newSelectedVariant);
    } else {
      setSelectedVariant(null);
    }
  }, [searchParams]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const closeModal = () => {setShowModal(false)};

  const addToCart = () => {
    if(selectedValues && quantity && Object.keys(allSelectables).length === Object.keys(selectedValues).length){
      const id = selectedVariant?.id;
      const resultBarem = baremList.find((item: BaremList) => quantity >= item.minimumQuantity && quantity <= item.maximumQuantity);
      console.log("id >> ", id);
      console.log("adet >> ", quantity);
      console.log("barem >> ", resultBarem);

      setShowModal(true);
    } else {
      return
    }
  }

  const ratings = () => (
    <div className="flex w-full items-start lg:ml-6">
      {[...Array(5)].map((_, index) => (
      <IoMdStar key={index} color="orange" fontSize="25px"/>
      ))}
      <p className="text-lg lg:text-xl ml-2 lg:ml-4 text-blue-500" >23 Yorum</p>
    </div>
  );

  const shipping = () => (
    <div className="flex w-full items-start mt-1 lg:ml-[200px]">
      <MdOutlineLocalShipping color="gray" fontSize="30px"/>
      <p className="text-xl lg:text-xl ml-2 lg:ml-4 " >Kargo ücreti: <span className="text-blue-500">{"Alıcı Öder"}</span></p>
    </div>
  )

  return (
    <div className='flex flex-col w-full md:w-3/5 md:h-min[850px] gap-2 md:p-4 md:pl-8 text-gray-800'>
      <h1 className='text-2xl md:text-3xl lg:text-4xl font-semibold lg:ml-6'>{productTitle}</h1>
      {ratings()}
      <p className='text-2xl lg:text-3xl font-bold mt-2 lg:mt-6 lg:ml-6'>
        {formatPrice(minPrice)} - {formatPrice(maxPrice)}
        <span className='text-xl lg:text-2xl text-gray-500 font-normal'> / Adet</span>
      </p>
      <p className='text-xl lg:text-2xl text-gray-500 lg:ml-6'>{minQuantity} Adet (Minimum Sipariş Adedi)</p>

      {selectableAttributes && selectableAttributes?.length > 0 && (selectableAttributes.map((item: SelectableAttribute, index: number) => (
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 mt-2 lg:mt-6 lg:pl-6" key={index}>
          <div className="flex lg:justify-between items-center">
            <p className="lg:w-[130px] text-lg lg:text-xl">{item.name}</p>
            <p className="text-lg lg:text-xl">:</p>
          </div>
          <div className="grid grid-cols-3 w-full gap-4 text-center">{item.values.map((value: string, index: number) => (
            <p
              className={`text-lg lg:text-xl p-1 lg:p-2 border-2 border-grey-200 rounded
                ${selectedValues && selectedValues[item.name] === value && "border-gray-600 cursor-pointer"}
                ${(selectables[item.name] && !selectables[item.name].includes(value)) ? "bg-gray-200 cursor-default" : "cursor-pointer"}
              `}
              key={index}
              onClick={() => selectAttribute(item.name, value)}
            >{value}</p>
          ))}</div>
        </div>
      )))}

      <div className="flex flex-col bg-gray-100 gap-4 md:gap-8 p-2 md:p-6 mt-4 md:mt-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 ">
          <div className="flex lg:justify-between">
            <p className="lg:w-[130px] text-lg lg:text-xl">Toptan Fiyat <br /> (Adet)</p>
            <p className="text-lg lg:text-xl text-center">:</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 w-full gap-4 text-center">
            {baremList.map((item: BaremList, index) => (
              <div className={`
                flex flex-col text-lg lg:text-xl ${(index + 1) % 4 === 0 ? '' : 'border-r-2'} border-gray-400
                ${quantity && quantity >= item.minimumQuantity && quantity <= item.maximumQuantity && `bg-amber-200`}
                `} key={index}>
                <p>{item.minimumQuantity} {item.maximumQuantity === maxQuantity ? ` +` : `- ${item.maximumQuantity}`}</p>
                <p>{formatPrice(item.price)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center">
          <div className="flex flex-row items-center">
            <div className="flex text-lg lg:text-xl items-center">
              <label htmlFor="quantityInput" className="text-lg lg:text-xl lg:w-[130px]">Adet</label>
              <p className="text-lg lg:text-xl text-center">:</p>
            </div>
            <input
              className="text-lg lg:text-xl text-center w-[80px] lg:w-[100px] ml-2 lg:ml-8 p-1 lg:p-2
              [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none 
              [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              id="quantityInput"
              type="number"
              defaultValue={minQuantity}
              onChange={() => setQuantity(null)}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => onQuantityChange(e)}
            />
            <p className="text-lg lg:text-xl ml-4" >Adet</p>
          </div>
          <p className="text-lg lg:text-xl ml-auto text-green-500 bg-white p-2 rounded my-4 md:my-0 mr-2 md:mr-0 md:mt-4 lg:mt-0" >Stok Adeti: {maxQuantity}</p>
        </div>
      </div>

      <div className="flex lg:text-2xl font-bold items-center mt-4 lg:ml-6">
        <p className="lg:w-[130px] text-xl">Toplam</p>
        <p className="text-center">:</p>
        <p className="text-2xl lg:text-4xl ml-auto lg:ml-8">{totalPrice}</p>
      </div>

      {shipping()}

      <div className="flex flex-col-reverse lg:flex-row w-full lg:items-center" >
        <Button
          disabled={!(selectedValues !== null && selectedValues !== undefined && Object.keys(allSelectables).length === Object.keys(selectedValues).length)}
          onClick={addToCart}
        />
        <p className="text-lg lg:text-xl text-blue-500 mb-2 lg:w-[300px] lg:mr-[160px]">{"Ödeme Seçenekleri"}</p>
      </div>

      {showModal ?
        <Modal closeModal={closeModal}>
          <div className="flex flex-col mx-auto p-4 bg-gray-300 rounded justify-center items-center w-[300px] h-[200px] gap-6">
            <IoCheckmarkCircleOutline color="green" fontSize="50px"/>
            <p className="text-gray-700">{"Başarılı bir şekilde sepete eklendi."}</p>
          </div>
        </Modal> :
        null
      }
    </div>
  );
};

export default ProductInfo;