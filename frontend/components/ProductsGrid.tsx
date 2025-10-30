import { useEffect, useState } from "react";
import backend from "~backend/client";
import type { Product } from "~backend/product/list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Loader2 } from "lucide-react";

interface ProductsGridProps {
  onCartUpdate: (count: number) => void;
}

export default function ProductsGrid({ onCartUpdate }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
    loadCartCount();
  }, []);

  const loadProducts = async () => {
    try {
      const { products } = await backend.product.list();
      setProducts(products);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const { items } = await backend.cart.get();
      onCartUpdate(items.length);
    } catch (error) {
      console.error("Failed to load cart count:", error);
    }
  };

  const handleAddToCart = async (productId: number) => {
    setAdding(productId);
    try {
      await backend.cart.add({ productId, quantity: 1 });
      await loadCartCount();
      toast({
        title: "Added to cart",
        description: "Product added successfully!",
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <div className="aspect-square bg-muted rounded-md mb-4 flex items-center justify-center">
                <span className="text-4xl">🛍️</span>
              </div>
              <CardTitle className="line-clamp-2">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleAddToCart(product.id)}
                disabled={adding === product.id}
                className="w-full"
              >
                {adding === product.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
