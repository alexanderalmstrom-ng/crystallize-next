import { graphql } from "@/gql/cart";

export const imageFragment = graphql(`
    fragment image on Image {
      url
      altText
      width
      height
    }
  `);
