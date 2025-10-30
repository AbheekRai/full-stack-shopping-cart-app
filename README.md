# Vibe Commerce - Full-Stack Shopping Cart Application

Hey there! Welcome to Vibe Commerce, a modern e-commerce shopping cart app I built using some really cool technologies. This project demonstrates a full-stack application with a clean separation between the backend API and frontend interface.

## What This App Does

Basically, it's a fully functional shopping cart system where you can:
- Browse through a catalog of products
- Add items to your cart (with quantity adjustments)
- View your cart and update quantities
- Remove items you don't want anymore
- Complete the checkout process
- Get a receipt with your order details

It's not connected to any real payment processor (this is a demo after all), but the entire flow from browsing to checkout works smoothly.

## Tech Stack Breakdown

### Backend (Encore.ts Framework)

I went with **Encore.ts** for the backend because it makes building REST APIs incredibly straightforward. Here's what makes it special:

- **Type-Safe API Definitions**: Instead of wrestling with OpenAPI specs or manually documenting endpoints, you just write TypeScript functions and the framework handles everything
- **Automatic API Generation**: The client libraries are auto-generated, so the frontend gets perfect type safety when calling backend APIs
- **Built-in Database Support**: PostgreSQL integration is baked right in - no need to configure ORMs or connection pools
- **Service Architecture**: The code is organized into logical services (products, cart, checkout), making it super easy to scale

The backend consists of three main services:

1. **Product Service** - Manages the product catalog
2. **Cart Service** - Handles adding, updating, and removing cart items
3. **Checkout Service** - Processes orders and generates receipts

### Frontend (React + TypeScript + Vite)

For the frontend, I chose a modern React stack:

- **React 19**: The latest version with all the good stuff
- **TypeScript**: Because types make everything better and catch bugs early
- **Vite**: Lightning-fast development server and build tool
- **Tailwind CSS v4**: Utility-first CSS that makes styling a breeze
- **shadcn/ui**: Pre-built, accessible components that look great out of the box
- **Lucide React**: Beautiful icon library

### Database (PostgreSQL)

All the data lives in a PostgreSQL database with two main tables:
- `products` - stores the product catalog
- `cart_items` - tracks what's currently in the shopping cart

The database gets seeded with 8 sample products automatically when you first run the app.

## How Everything Connects

This is the part I think is really cool. Encore.ts automatically generates a type-safe client that the frontend can import:

```typescript
import backend from '~backend/client';

// This is fully typed! Your editor knows exactly what parameters
// this function expects and what it returns
const response = await backend.cart.add({ 
  productId: 1, 
  quantity: 2 
});
```

No manual API documentation needed. No keeping types in sync between frontend and backend. It just works.

## Project Structure

Here's how the code is organized:

```
├── backend/
│   ├── cart/               # Shopping cart service
│   │   ├── add.ts         # Add items to cart
│   │   ├── get.ts         # Retrieve cart contents
│   │   ├── update.ts      # Update item quantities
│   │   ├── remove.ts      # Remove items from cart
│   │   └── encore.service.ts
│   ├── checkout/           # Checkout service
│   │   ├── process.ts     # Process orders
│   │   └── encore.service.ts
│   ├── product/            # Product catalog service
│   │   ├── list.ts        # List all products
│   │   └── encore.service.ts
│   └── db/
│       ├── index.ts       # Database configuration
│       └── migrations/
│           └── 001_create_tables.up.sql
├── frontend/
│   ├── App.tsx            # Main application component
│   ├── components/
│   │   ├── ProductsGrid.tsx    # Product listing
│   │   ├── Cart.tsx            # Shopping cart view
│   │   ├── CheckoutForm.tsx    # Checkout interface
│   │   ├── ReceiptModal.tsx    # Order receipt
│   │   └── ui/                 # shadcn/ui components
│   └── lib/
│       └── utils.ts       # Utility functions
```

## Key Features & Implementation Details

### 1. Product Catalog

The product listing pulls from the database and displays products in a responsive grid. Each product card shows:
- Product image (placeholder in this demo)
- Name and description
- Price
- "Add to Cart" button

The grid automatically adjusts for different screen sizes using Tailwind's responsive utilities.

### 2. Shopping Cart Logic

The cart has some smart behavior built in:
- When you add a product that's already in your cart, it increments the quantity instead of creating a duplicate entry
- You can adjust quantities directly in the cart view
- Removing an item updates the total price immediately
- The cart badge in the header shows the total number of items

This is handled by the `cart` service in the backend, which manages all the database queries for cart operations.

### 3. Checkout Flow

The checkout process is straightforward:
1. Click "Checkout" from the cart view
2. Enter your name and email
3. Submit the order
4. Get a receipt modal with order details

After checkout, the cart is automatically cleared. The receipt shows:
- Unique order ID (generated using timestamp + random string)
- Customer info
- Itemized list with quantities and subtotals
- Grand total
- Order timestamp

### 4. Real-Time Updates

The app maintains a cart count in the header that updates whenever you add or remove items. This is done through React state management, with callbacks that propagate changes from child components back up to the main App component.

### 5. Error Handling

The app includes proper error handling:
- Toast notifications for success/error messages
- API errors are caught and displayed to users
- Empty cart validation prevents checkout with no items

## Database Schema

The database is pretty simple but effective:

```sql
-- Products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  description TEXT,
  image_url TEXT
);

-- Cart items table
CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

The `product_id` has a foreign key constraint to ensure data integrity - you can't add a non-existent product to the cart.

## API Endpoints

All endpoints are defined using Encore.ts's `api` function. Here are the main ones:

### Products
- `GET /api/products` - List all products

### Cart
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get cart contents
- `PUT /api/cart/:id` - Update item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Checkout
- `POST /api/checkout` - Process order and clear cart

## How the Deployment Works

This app is running on Encore's hosting platform, which handles:
- Automatic deployments when code changes
- Database provisioning and migrations
- Environment management
- HTTPS and domain setup

The frontend and backend are deployed separately but communicate seamlessly:
- Frontend: Deployed as a static site with Vite build output
- Backend: Running as Encore.ts services with PostgreSQL database

## Development Experience

One of the best parts about this stack is how smooth the development experience is:

1. **Hot Module Replacement**: Changes to React components show up instantly
2. **Type Safety**: If you break an API contract, TypeScript tells you immediately
3. **Database Migrations**: Handled automatically - just write SQL files
4. **No Build Configuration**: Both Encore.ts and Vite work out of the box

## Future Enhancements

If I were to expand this project, here are some ideas:

- User authentication (add login/signup)
- Persistent carts per user
- Order history page
- Product search and filtering
- Inventory management
- Real payment integration (Stripe, PayPal)
- Product reviews and ratings
- Wishlist functionality
- Admin dashboard for managing products

## Getting Started (For Local Development)

If you want to run this locally, here's what you need:

1. **Install Encore CLI**:
   ```bash
   curl -L https://encore.dev/install.sh | bash
   ```

2. **Clone and setup**:
   ```bash
   # Install backend dependencies
   cd backend
   bun install
   
   # Install frontend dependencies  
   cd ../frontend
   bun install
   ```

3. **Run the app**:
   ```bash
   encore run
   ```

That's it! Encore handles database setup, migrations, and running both frontend and backend.

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## Notes on the Implementation

A few things worth mentioning:

- **No Real Images**: The product images are just placeholder paths. In a real app, you'd either use a CDN or Encore's Object Storage for images.
  
- **Simple Cart Model**: The current implementation uses a single global cart. In production, you'd associate carts with user sessions or authenticated users.

- **Mock Checkout**: The checkout doesn't actually charge money or integrate with payment providers. It just generates a receipt and clears the cart.

- **No Persistence of Orders**: Completed orders aren't saved to the database. You could easily add an `orders` table to track purchase history.

## Wrapping Up

This project demonstrates how modern tools can make full-stack development really enjoyable. The combination of Encore.ts for the backend and React for the frontend creates a development workflow that's both productive and type-safe.

The whole thing - from database to API to UI - works together seamlessly, and adding new features is straightforward because the architecture is clean and well-organized.
<img width="2471" height="1391" alt="image" src="https://github.com/user-attachments/assets/37641bcd-5f09-4656-ae62-670c34bcaad4" />

