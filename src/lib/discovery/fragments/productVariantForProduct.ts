import { graphql } from "@/gql/discovery";

export const productVariantForProductFragment = graphql(`
  fragment productVariantForProduct on ProductVariantForProduct {
    name
    sku
    images {
        ...image
    }
    defaultPrice
  }
`);
