"use client";

import { startTransition, useActionState } from "react";
import { useMiniCartStore } from "@/components/MiniCart/MiniCart.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductFragment } from "@/gql/discovery/graphql";
import { getVariantsWithSkuAndName } from "@/utils/variant";
import { addToCartAction } from "./ProductForm.actions";

export default function ProductForm({ product }: { product: ProductFragment }) {
  const [_, formAction, isPending] = useActionState(addToCartAction, null);
  const variants = getVariantsWithSkuAndName(product?.variants);
  const setOpen = useMiniCartStore((state) => state.setOpen);

  return (
    <form
      action={formAction}
      onSubmit={() => {
        startTransition(() => {
          setOpen(true);
        });
      }}
      className="flex flex-col gap-2"
    >
      <input type="hidden" name="sku" value={variants?.[0]?.sku ?? ""} />
      <div className="flex gap-2">
        <Input
          className="w-auto max-w-16 px-2 text-center"
          type="number"
          name="quantity"
          min={1}
          defaultValue={1}
        />
        <Button type="submit" className="grow" disabled={isPending}>
          {isPending ? "Adding to cart..." : "Add to cart"}
        </Button>
      </div>
    </form>
  );
}
