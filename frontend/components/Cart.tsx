import { useEffect, useState } from "react";
import backend from "~backend/client";
import type { GetCartResponse, CartItemDetails } from "~backend/cart/get";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import CheckoutForm from "./CheckoutForm";

interface CartProps {
  onClose: () => void;
  onCartUpdate: (count: number) => void;
}

export default function Cart({ onClose, onCartUpdate }: CartProps) {
  const [cart, setCart] = useState<GetCartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await backend.cart.get();
      setCart(cartData);
      onCartUpdate(cartData.items.length);
    } catch (error) {
      console.error("Failed to load cart:", error);
      toast({
        title: "Error",
        description: "Failed to load cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    setUpdating(id);
    try {
      await backend.cart.remove({ id });
      await loadCart();
      toast({
        title: "Removed",
        description: "Item removed from cart.",
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdating(id);
    try {
      await backend.cart.update({ id, quantity });
      await loadCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (showCheckout && cart) {
    return (
      <CheckoutForm
        cart={cart}
        onBack={() => setShowCheckout(false)}
        onSuccess={() => {
          loadCart();
          setShowCheckout(false);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={onClose} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold">Shopping Cart</h2>
      </div>

      {!cart || cart.items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <Button onClick={onClose}>Continue Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {cart.items.map((item: CartItemDetails) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.productName}</h3>
                    <p className="text-muted-foreground">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={updating === item.id || item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={updating === item.id}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="w-24 text-right font-semibold">
                    ${item.subtotal.toFixed(2)}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemove(item.id)}
                    disabled={updating === item.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Total</span>
                <span className="text-3xl">${cart.total.toFixed(2)}</span>
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => setShowCheckout(true)} className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
