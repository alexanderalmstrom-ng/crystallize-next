import { graphql } from "@/gql/cart";

export const productVariantFragment = graphql(`
    fragment productVariant on ProductVariant {
      name
      sku
      images {
        ...image
      }
      price {
        net
        gross
        currency
      }
      attributes
    }
  `);
