export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'prod_SlPD1JqUc68krM',
    priceId: 'price_1RpsOcG0aBF2zEWXm5En3UxJ',
    name: 'Reviu Car',
    description: 'Faça laudos profissionais em segundos com IA.',
    mode: 'subscription'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};