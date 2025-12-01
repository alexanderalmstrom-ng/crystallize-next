import { graphql } from "@/gql/cart";

export const cartFragment = graphql(`
    fragment cart on Cart {
      id
      items {
        name
        price {
          gross
          net
          currency
          discounts {
            amount
          }
        }
        quantity
        variant {
          ...productVariant
        }
      }
    }
  `);
