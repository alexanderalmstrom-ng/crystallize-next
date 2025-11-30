"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import type { ComponentProps } from "react";
import { type FragmentType, getFragmentData } from "@/gql/cart";
import { imageFragment } from "@/lib/cart/fragments/image";
import { productVariantFragment } from "@/lib/cart/fragments/productVariant";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import Price from "../Price/Price";
import { Heading } from "../ui/heading";

export default function MiniCartContent() {
  const trpc = useTRPC();
  const { data: cart, isPending } = useQuery(trpc.cart.cart.queryOptions());

  const variants = cart?.items.map((item) =>
    getFragmentData(productVariantFragment, item.variant),
  );

  if (isPending) return <div>Loading cart...</div>;

  return (
    <div className="p-4 flex flex-col">
      {variants?.map((variant) => (
        <div key={variant?.sku} className="flex flex-row gap-2">
          {variant.images?.[0] && (
            <ProductVariantImage
              className="w-16 h-16"
              image={variant.images[0]}
            />
          )}
          <div className="flex flex-col gap-0.5 grow">
            <Heading>{variant?.name}</Heading>
            <Price className="text-sm" amount={variant.price.gross} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductVariantImage({
  className,
  image,
  ...props
}: Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  image: FragmentType<typeof imageFragment>;
}) {
  const imageData = getFragmentData(imageFragment, image);

  if (!imageData?.url) return null;

  return (
    <picture className="bg-accent">
      <Image
        className={cn("object-contain mix-blend-multiply", className)}
        src={imageData?.url}
        alt={imageData?.altText ?? ""}
        width={imageData?.width ?? 128}
        height={imageData?.height ?? 128}
        sizes="64px"
        {...props}
      />
    </picture>
  );
}
