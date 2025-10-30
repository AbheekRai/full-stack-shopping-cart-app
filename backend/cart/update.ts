import { api, APIError } from "encore.dev/api";
import db from "../db";

interface UpdateCartItemRequest {
  id: number;
  quantity: number;
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

// Updates the quantity of a cart item
export const update = api<UpdateCartItemRequest, CartItem>(
  { expose: true, method: "PUT", path: "/api/cart/:id" },
  async ({ id, quantity }) => {
    if (quantity <= 0) {
      throw APIError.invalidArgument("quantity must be greater than 0");
    }

    const item = await db.queryRow<CartItem>`
      UPDATE cart_items
      SET quantity = ${quantity}
      WHERE id = ${id}
      RETURNING id, product_id as "productId", quantity
    `;

    if (!item) {
      throw APIError.notFound("cart item not found");
    }

    return item;
  }
);
