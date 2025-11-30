"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { type FragmentType, getFragmentData } from "@/gql/cart";
import { imageFragment } from "@/lib/cart/fragments/image";
import { productVariantFragment } from "@/lib/cart/fragments/productVariant";
import { useTRPC } from "@/trpc/client";

export default function Cart() {
  const trpc = useTRPC();
  const { data: cart, isPending } = useQuery(trpc.cart.cart.queryOptions());

  const variants = cart?.items.map((item) =>
    getFragmentData(productVariantFragment, item.variant),
  );

  if (isPending) return <div>Loading cart...</div>;

  return (
    <div>
      {variants?.map((variant) => (
        <div key={variant?.sku}>
          <h3>{variant?.name}</h3>
          <p>
            {variant.images?.[0] && (
              <ProductVariantImage image={variant.images[0]} />
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

function ProductVariantImage({
  image,
}: {
  image: FragmentType<typeof imageFragment>;
}) {
  const imageData = getFragmentData(imageFragment, image);

  if (!imageData?.url) return null;

  return (
    <Image
      src={imageData?.url}
      alt={imageData?.altText ?? ""}
      width={imageData?.width}
      height={imageData?.height}
    />
  );
}
