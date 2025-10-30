import { api } from "encore.dev/api";
import db from "../db";

export interface CartItemDetails {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface GetCartResponse {
  items: CartItemDetails[];
  total: number;
}

// Retrieves the current shopping cart with total
export const get = api<void, GetCartResponse>(
  { expose: true, method: "GET", path: "/api/cart" },
  async () => {
    const items = await db.queryAll<CartItemDetails>`
      SELECT 
        ci.id,
        ci.product_id as "productId",
        p.name as "productName",
        p.price,
        ci.quantity,
        (p.price * ci.quantity) as subtotal
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      ORDER BY ci.created_at DESC
    `;

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return { items, total };
  }
);
