import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import ProductsGrid from "./components/ProductsGrid";
import Cart from "./components/Cart";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Vibe Commerce</h1>
          </div>
          <Button
            onClick={() => setCartOpen(!cartOpen)}
            variant="outline"
            className="relative"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {cartOpen ? (
          <Cart onClose={() => setCartOpen(false)} onCartUpdate={setCartCount} />
        ) : (
          <ProductsGrid onCartUpdate={setCartCount} />
        )}
      </main>

      <Toaster />
    </div>
  );
}
