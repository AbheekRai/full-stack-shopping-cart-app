import { api, APIError } from "encore.dev/api";
import db from "../db";

interface RemoveFromCartRequest {
  id: number;
}

// Removes an item from the shopping cart
export const remove = api<RemoveFromCartRequest, void>(
  { expose: true, method: "DELETE", path: "/api/cart/:id" },
  async ({ id }) => {
    const result = await db.queryRow<{ count: number }>`
      DELETE FROM cart_items
      WHERE id = ${id}
      RETURNING 1 as count
    `;

    if (!result) {
      throw APIError.notFound("cart item not found");
    }
  }
);
