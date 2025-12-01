import { caller } from "@/trpc/server";
import { resolveProductVariantsForProductFragment } from "@/utils/variant";
import ProductListCard from "./ProductListCard";

export default async function ProductList() {
  const products = await caller.product.products();

  if (!products) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
      {products.map((product) => {
        if (!product) return null;

        const defaultVariant = resolveProductVariantsForProductFragment([
          product.defaultVariant,
        ])?.[0];

        if (!defaultVariant) return null;

        const defaultVariantImage = defaultVariant?.images?.[0];

        return (
          <ProductListCard
            key={product.id}
            productTitle={product.name}
            productPrice={defaultVariant.defaultPrice ?? 0}
            productImage={defaultVariantImage}
          />
        );
      })}
    </div>
  );
}
