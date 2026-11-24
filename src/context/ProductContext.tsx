import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { PRODUCTS } from '../data/catalog';
import type { Product } from '../data/catalog';

const STORAGE_KEY = 'guitarhero_products';

interface ProductContextType {
  products: Product[];
  addProduct: (data: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, data: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | null>(null);

function loadInitialProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Si hay datos corruptos en localStorage, vuelve al catálogo base
  }
  return PRODUCTS;
}

function generateId(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug || 'producto'}-${Date.now().toString(36)}`;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadInitialProducts);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (data: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...data, id: generateId(data.name) };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, data: Omit<Product, 'id'>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...data, id } : product))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProductById = (id: string) => products.find((p) => p.id === id);

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProductById }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe usarse dentro de un ProductProvider');
  }
  return context;
}