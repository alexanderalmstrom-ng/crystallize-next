import Image from "next/image";
import type { ComponentProps } from "react";
import type { FragmentType } from "@/gql/cart";
import { getFragmentData } from "@/gql/cart";
import type { CartFragment } from "@/gql/cart/graphql";
import { imageFragment } from "@/lib/cart/fragments/image";
import { productVariantFragment } from "@/lib/cart/fragments/productVariant";
import { cn } from "@/lib/utils";
import { removeLeadingSlash } from "@/utils/common";
import { formatPrice } from "@/utils/price";
import Price from "../Price/Price";
import { Heading } from "../ui/heading";
import MiniCartItemLink from "./MiniCartItemLink";
import MiniCartQuantityForm from "./MiniCartQuantityForm";

export default function MiniCartItem({
  item,
}: {
  item: CartFragment["items"][number];
}) {
  const totalDiscountAmount = item?.price.discounts
    ?.map((discount) => discount.amount)
    .reduce((acc, discount) => acc + discount, 0);
  const variant = getFragmentData(productVariantFragment, item.variant);

  return (
    <div key={variant.sku} className="flex flex-row gap-2">
      {variant.images?.[0] && (
        <MiniCartItemLink
          href={`/product/${removeLeadingSlash(variant.product.path)}`}
        >
          <ProductVariantImage className="size-20" image={variant.images[0]} />
        </MiniCartItemLink>
      )}
      <div className="flex flex-col grow">
        <Heading className="flex items-start text-lg">{variant.name}</Heading>
        <ProductVariantDiscount
          totalDiscountAmount={totalDiscountAmount}
          totalGrossAmount={item.price.gross}
        />
        <Price className="text-sm" amount={item.price.net} />
        <MiniCartQuantityForm sku={variant.sku} quantity={item.quantity} />
      </div>
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
