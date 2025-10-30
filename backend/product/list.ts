import { api } from "encore.dev/api";
import db from "../db";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
}

interface ListProductsResponse {
  products: Product[];
}

// Retrieves all available products
export const list = api<void, ListProductsResponse>(
  { expose: true, method: "GET", path: "/api/products" },
  async () => {
    const products = await db.queryAll<Product>`
      SELECT id, name, price, description, image_url as "imageUrl"
      FROM products
      ORDER BY id
    `;
    return { products };
  }
);
