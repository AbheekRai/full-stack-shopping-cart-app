import { api, APIError } from "encore.dev/api";
import db from "../db";

interface CheckoutRequest {
  name: string;
  email: string;
}

export interface CheckoutItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CheckoutResponse {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: CheckoutItem[];
  total: number;
  timestamp: Date;
}

// Processes checkout and returns a mock receipt
export const process = api<CheckoutRequest, CheckoutResponse>(
  { expose: true, method: "POST", path: "/api/checkout" },
  async ({ name, email }) => {
    // Get current cart items
    const items = await db.queryAll<CheckoutItem>`
      SELECT 
        p.name as "productName",
        ci.quantity,
        p.price,
        (p.price * ci.quantity) as subtotal
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
    `;

    if (items.length === 0) {
      throw APIError.invalidArgument("cart is empty");
    }

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Clear cart after checkout
    await db.exec`DELETE FROM cart_items`;

    // Generate mock order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      orderId,
      customerName: name,
      customerEmail: email,
      items,
      total,
      timestamp: new Date(),
    };
  }
);
