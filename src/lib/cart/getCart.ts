import z from "zod";
import { getFragmentData, graphql } from "@/gql/cart";
import { getAuthToken } from "../auth";
import { crystallizeCart } from "../crystallize/client";
import { cartFragment } from "./fragments/cart";

const cartQuery = graphql(`
  query GetCart($id: UUID) {
    cart(id: $id) {
      ...cart
    }
  }
`);

export async function getCart() {
  const { cookies } = await import("next/headers");
  const cartCookie = z
    .string()
    .min(1)
    .safeParse((await cookies()).get("cart")?.value);

  if (!cartCookie.success) {
    return null;
  }

  const { decryptedToken } = await getAuthToken();
  const cart = await crystallizeCart({
    query: cartQuery,
    variables: {
      id: cartCookie.data,
    },
    headers: {
      Authorization: `Bearer ${decryptedToken}`,
    },
  });

  return getFragmentData(cartFragment, cart?.data?.cart);
}
