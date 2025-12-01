import z from "zod";
import { getFragmentData, graphql } from "@/gql/cart";
import { getAuthToken } from "../auth";
import { crystallizeCart } from "../crystallize/client";
import { cartFragment } from "./fragments/cart";

const hydrateCartMutation = graphql(`
    mutation HydrateCart($input: CartInput!) {
      hydrate(input: $input) {
        ...cart
      }
    }
  `);

const HydrateCartInputSchema = z.object({
  input: z.object({
    id: z.string().optional(),
    items: z.array(
      z.object({
        sku: z.string(),
        quantity: z.number().default(1),
      }),
    ),
  }),
});

export async function hydrateCart(
  input: z.infer<typeof HydrateCartInputSchema>["input"],
) {
  const { decryptedToken } = await getAuthToken();

  const cart = await crystallizeCart({
    query: hydrateCartMutation,
    variables: {
      input,
    },
    headers: {
      Authorization: `Bearer ${decryptedToken}`,
    },
  });

  const cartData = getFragmentData(cartFragment, cart?.data?.hydrate);

  return cartData;
}
