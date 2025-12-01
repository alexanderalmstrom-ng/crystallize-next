import { caller } from "@/trpc/server";
import { removeLeadingSlash } from "@/utils/common";
import { resolveProductVariantsForProductFragment } from "@/utils/variant";
import ProductListCard from "./ProductListCard";

export default async function ProductList() {
  const products = await caller.product.products();

  if (!products) return null;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-px">
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
            productPath={
              product.path ? removeLeadingSlash(product.path) : undefined
            }
            productTitle={product.name}
            productPrice={defaultVariant.defaultPrice ?? 0}
            productImage={defaultVariantImage}
          />
        );
      })}
    </div>
  );
}
