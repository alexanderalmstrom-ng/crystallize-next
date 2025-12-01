"use client";

import { ShoppingBasketIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useMiniCartStore } from "./MiniCart.store";

export default function MiniCart({
  children,
  total,
}: {
  children: React.ReactNode;
  total?: number;
}) {
  const open = useMiniCartStore((state) => state.open);
  const setOpen = useMiniCartStore((state) => state.setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative">
          <ShoppingBasketIcon strokeWidth={1.5} />
          {total && (
            <span className="text-xs absolute top-0.5 right-1.5 text-primary leading-none flex items-center justify-center">
              {total}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle>Cart</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
