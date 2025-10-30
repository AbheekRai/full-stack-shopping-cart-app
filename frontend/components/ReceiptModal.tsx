import type { CheckoutResponse, CheckoutItem } from "~backend/checkout/process";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ReceiptModalProps {
  receipt: CheckoutResponse;
  onClose: () => void;
}

export default function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 border-green-500">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <p className="text-muted-foreground">Thank you for your purchase</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-mono font-semibold">{receipt.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-semibold">{receipt.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{receipt.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{new Date(receipt.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Items Ordered:</h3>
            {receipt.items.map((item: CheckoutItem, index: number) => (
              <div key={index} className="flex justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Paid</span>
              <span className="text-2xl font-bold">${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            A confirmation email has been sent to {receipt.customerEmail}
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose} className="w-full" size="lg">
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
