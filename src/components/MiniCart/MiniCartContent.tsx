"use client";

import useCart from "@/hooks/useCart";
import MiniCartProductItem from "./MiniCartProductItem";

export default function MiniCartContent() {
  const { data: cart, isPending } = useCart();

  if (isPending) return <div>Loading cart...</div>;

  return (
    <div className="p-4 flex flex-col">
      {cart?.items?.map((item) => {
        return <MiniCartProductItem key={item.name} item={item} />;
      })}
    </div>
  );
}
