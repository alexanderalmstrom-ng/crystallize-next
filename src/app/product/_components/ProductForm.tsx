"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductFragment } from "@/gql/discovery/graphql";
import { getVariantsWithSkuAndName } from "@/utils/variant";
import { addToCartAction } from "./ProductForm.actions";

export default function ProductForm({ product }: { product: ProductFragment }) {
  const [_, formAction, isPending] = useActionState(addToCartAction, null);
  const variants = getVariantsWithSkuAndName(product?.variants);

  return (
    <form action={formAction} className="flex flex-col gap-2">
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
