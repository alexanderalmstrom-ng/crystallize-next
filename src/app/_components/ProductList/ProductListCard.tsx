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
      <picture className="bg-secondary flex">
        <Image
          className="object-contain mix-blend-multiply aspect-4/5"
          src={image.url}
          alt={image.altText ?? props.productTitle ?? ""}
          width={image.width ?? 1000}
          height={image.height ?? 1000}
        />
      </picture>
      <div className="flex flex-col px-4 py-3">
        <h3>{props.productTitle}</h3>
        <p>{formatPrice(props.productPrice)}</p>
      </div>
    </div>
  );
}
