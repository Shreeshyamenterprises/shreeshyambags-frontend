export type PricingTier = {
  id?: string;
  minQtyKg: number;
  pricePerKg: number;
};

export type Variant = {
  id: string;
  size: string;
  color: string;
  shape: string;
  price: number;
  stock: number;
  sku?: string | null;
  isActive?: boolean;
  gsm?: number | null;
  pricePerKg?: number | null;
  pricingTiers?: PricingTier[];
  product?: {
    id: string;
    title: string;
    slug: string;
    images?: { id?: string; url: string }[];
  };
};

export type ProductImage = {
  url: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  basePrice?: number | null;
  images: ProductImage[];
  variants?: Variant[];
};

export type User = {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  createdAt?: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type CartItem = {
  id: string;
  userId: string;
  variantId: string;
  quantity: number;
  customText?: string | null;
  variant: Variant & {
    product: {
      id: string;
      title: string;
      slug: string;
      images?: ProductImage[];
    };
  };
};

export type CartResponse = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  totalKg: number;
  total: number;
};
