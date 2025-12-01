"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import type { ComponentProps } from "react";
import { type FragmentType, getFragmentData } from "@/gql/cart";
import useCart from "@/hooks/useCart";
import { imageFragment } from "@/lib/cart/fragments/image";
import { productVariantFragment } from "@/lib/cart/fragments/productVariant";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/price";
import Price from "../Price/Price";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";

export default function MiniCartContent() {
  const { data: cart, isPending } = useCart();

  const items = cart?.items.map((item) => {
    return {
      ...item,
      variant: getFragmentData(productVariantFragment, item.variant),
    };
  });

  if (isPending) return <div>Loading cart...</div>;

  return (
    <div className="p-4 flex flex-col">
      {items?.map((item) => {
        const totalDiscountAmount = item?.price.discounts
          ?.map((discount) => discount.amount)
          .reduce((acc, discount) => acc + discount, 0);

        return (
          <div key={item?.variant.sku} className="flex flex-row gap-2">
            {item.variant.images?.[0] && (
              <ProductVariantImage
                className="size-20"
                image={item.variant.images[0]}
              />
            )}
            <div className="flex flex-col grow">
              <Heading className="flex items-start text-lg">
                {item?.variant.name}
                <span className="text-xxs">{item.quantity}</span>
              </Heading>
              <ProductVariantDiscount
                totalDiscountAmount={totalDiscountAmount}
                totalGrossAmount={item.price.gross}
              />
              <Price className="text-sm" amount={item.price.net} />
              <ProductVariantQuantitySelect quantity={item.quantity} />
            </div>
          </div>
        );
      })}
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
        width={imageData?.width ?? 160}
        height={imageData?.height ?? 160}
        sizes="80px"
        {...props}
      />
    </picture>
  );
}

function ProductVariantDiscount({
  totalDiscountAmount,
  totalGrossAmount,
}: {
  totalDiscountAmount?: number;
  totalGrossAmount: number;
}) {
  if (typeof totalDiscountAmount !== "number" || totalDiscountAmount === 0) {
    return null;
  }

  return (
    <>
      <p className="text-sm text-destructive">
        -{formatPrice(totalDiscountAmount)}
      </p>
      <Price
        className="text-sm line-through text-muted-foreground"
        amount={totalGrossAmount}
      />
    </>
  );
}

function ProductVariantQuantitySelect({ quantity }: { quantity: number }) {
  return (
    <form className="flex flex-row gap-2 mt-2 items-center">
      <Button variant="secondary" size="icon-sm">
        <MinusIcon className="size-2" />
      </Button>
      <span className="text-sm">{quantity}</span>
      <Button variant="secondary" size="icon-sm">
        <PlusIcon className="size-2" />
      </Button>
    </form>
  );
}
