export type CartItem = {
  id: string;
  name: string;
  price: number;
  salePrice?: number | undefined;
  quantity: number;
  thumbnailUri: string;
};
