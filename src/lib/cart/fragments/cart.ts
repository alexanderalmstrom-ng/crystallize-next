import { graphql } from "@/gql/cart";

export const cartFragment = graphql(`
    fragment cart on Cart {
      id
      items {
        variant {
          ...productVariant
        }
        quantity
        price {
          gross
          net
          currency
        }
      }
    }
  `);
