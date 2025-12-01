import Image from "next/image";
import { type FragmentType, getFragmentData } from "@/gql/discovery";
import { imageFragment } from "@/lib/discovery/fragments/image";
import { formatPrice } from "@/utils/price";

type ProductListCardProps = {
  productTitle: string | null | undefined;
  productPrice: number;
  productImage: FragmentType<typeof imageFragment> | null | undefined;
};

export default function ProductListCard(props: ProductListCardProps) {
  const image = getFragmentData(imageFragment, props.productImage);

  if (!image?.url) return null;

  return (
    <div>
      <Image
        src={image.url}
        alt={image.altText ?? props.productTitle ?? ""}
        width={image.width ?? 1000}
        height={image.height ?? 1000}
      />
      <h3>{props.productTitle}</h3>
      <p>{formatPrice(props.productPrice)}</p>
    </div>
  );
}
