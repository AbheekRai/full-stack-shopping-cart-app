import { api } from "encore.dev/api";
import db from "../db";

interface AddToCartRequest {
  productId: number;
  quantity: number;
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

// Adds a product to the shopping cart
export const add = api<AddToCartRequest, CartItem>(
  { expose: true, method: "POST", path: "/api/cart" },
  async ({ productId, quantity }) => {
    // Check if item already exists in cart
    const existing = await db.queryRow<CartItem>`
      SELECT id, product_id as "productId", quantity
      FROM cart_items
      WHERE product_id = ${productId}
    `;

    if (existing) {
      // Update quantity
      await db.exec`
        UPDATE cart_items
        SET quantity = quantity + ${quantity}
        WHERE id = ${existing.id}
      `;
      return {
        id: existing.id,
        productId: existing.productId,
        quantity: existing.quantity + quantity,
      };
    }

    // Insert new item
    const item = await db.queryRow<CartItem>`
      INSERT INTO cart_items (product_id, quantity)
      VALUES (${productId}, ${quantity})
      RETURNING id, product_id as "productId", quantity
    `;

    return item!;
  }
);
