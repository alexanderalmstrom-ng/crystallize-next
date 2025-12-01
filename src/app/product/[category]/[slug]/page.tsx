import { notFound } from "next/navigation";
import Price from "@/components/Price/Price";
import { Heading } from "@/components/ui/heading";
import type { ProductFragment } from "@/gql/discovery/graphql";
import { getProductByPath } from "@/lib/discovery/product";
import { getVariantsWithSkuAndName } from "@/utils/variant";
import ProductForm from "../../_components/ProductForm";
import ProductGalleryCarousel from "../../_components/ProductGalleryCarousel";

export default async function ProductPage({
  params,
}: PageProps<"/product/[category]/[slug]">) {
  const { category, slug } = await params;
  const product = await getProductByPath({ path: [category, slug].join("/") });

  if (!product) {
    notFound();
  }

  const productVariants = getVariantsWithSkuAndName(product?.variants);
  const productVariantImages = productVariants?.flatMap(
    (variant) => variant?.images,
  );

  return (
    <div className="grid lg:grid-cols-2 2xl:grid-cols-[1.5fr_minmax(auto,48rem)] -translate-y-17 xl:-translate-y-26">
      <ProductGalleryCarousel images={productVariantImages} />
      <ProductDetails product={product} />
    </div>
  );
}

function ProductDetails({ product }: { product: ProductFragment }) {
  return (
    <div className="p-4 lg:px-8 lg:py-6 flex flex-col gap-4">
      <header className="flex flex-col gap-2 lg:pt-26">
        <Heading asChild>
          <h1 className="text-2xl lg:text-4xl">{product.name}</h1>
        </Heading>
        <Price amount={product.defaultVariant?.defaultPrice} />
      </header>
      <ProductForm product={product} />
    </div>
  );
}
