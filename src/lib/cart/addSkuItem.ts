import type z from "zod";
import { graphql } from "@/gql/cart";
import { getAuthToken } from "../auth";
import { crystallizeCart } from "../crystallize/client";
import type { AddToCartInputSchema } from "./addToCart";

const addSkuItemMutation = graphql(`
    mutation AddSkuItem($id: UUID, $input: CartSkuItemInput!) { 
      addSkuItem(id: $id, input: $input) {
        id
      }
    }
  `);

export async function addSkuItemToCart(
  cartId: string,
  items: z.infer<typeof AddToCartInputSchema>["items"],
) {
  const { decryptedToken } = await getAuthToken();
  const addSkuItem = await crystallizeCart({
    query: addSkuItemMutation,
    variables: {
      id: cartId,
      input: {
        sku: items[0].sku,
        quantity: items[0].quantity,
      },
    },
    headers: {
      Authorization: `Bearer ${decryptedToken}`,
    },
  });

  return addSkuItem.data?.addSkuItem;
}
