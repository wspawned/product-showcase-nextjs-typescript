export interface ProductData {
  productTitle: string;
  selectableAttributes: SelectableAttribute[];
  productVariants: ProductVariant[];
  baremList: BaremList[];
}

export interface BaremList {
  minimumQuantity: number;
  maximumQuantity: number;
  price: number;
}

export interface ProductVariant {
  id: string;
  attributes: Attribute[];
  images: string[];
}

export interface Attribute {
  name: string;
  selectable: boolean;
  value: string;
}

export interface SelectableAttribute {
  name: string;
  values: string[];
}