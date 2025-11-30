import { cookies } from "next/headers";
import z from "zod";
import { graphql } from "@/gql/cart";
import { getAuthToken } from "../auth";
import { crystallizeCart } from "../crystallize/client";

const cartQuery = graphql(`
  query GetCart($id: UUID) {
    cart(id: $id) {
      id
    }
  }
`);

export async function getCart() {
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

  return cart?.data?.cart;
}
