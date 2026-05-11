export interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  base_price: number;
  owner_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
}

export interface CreateProductPayload {
  name: string;
  description: string;
  base_price: number;
  owner_id: number;
  image_urls: string[];
}
