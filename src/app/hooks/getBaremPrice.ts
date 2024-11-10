import { BaremList } from "@/types/models";

const getBaremPrice = (quantity: number, baremList: BaremList[]) => {
  const price = baremList.find((item: BaremList) => quantity >= item.minimumQuantity && quantity <= item.maximumQuantity)?.price;
  return price ?? null;
}

export default getBaremPrice;