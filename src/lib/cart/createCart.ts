import z from "zod";
import { graphql } from "@/gql/cart";
import { CART_COOKIE_EXPIRATION_TIME } from "@/utils/auth";
import { getAuthToken } from "../auth";
import { crystallizeCart } from "../crystallize/client";

const createCartMutation = graphql(`
    mutation CreateCart($input: CartInput!) {
      cart: hydrate(input: $input) {
        id
      }
    }
  `);

const CreateCartInputSchema = z.object({
  input: z.object({
    items: z.array(
      z.object({
        sku: z.string(),
        quantity: z.number().default(1),
      }),
    ),
  }),
});

export async function createCart(
  input: z.infer<typeof CreateCartInputSchema>["input"],
) {
  const { decryptedToken } = await getAuthToken();

  const newCart = await crystallizeCart({
    query: createCartMutation,
    variables: {
      input,
    },
    headers: {
      Authorization: `Bearer ${decryptedToken}`,
    },
  });

  const cartIdValidation = z.string().safeParse(newCart?.data?.cart?.id);

  if (!cartIdValidation.success) {
    throw new Error("Invalid cart ID");
  }

  await setCartCookie(cartIdValidation.data);

  return newCart?.data?.cart;
}

export async function setCartCookie(cartId: string) {
  const { cookies } = await import("next/headers");
  return (await cookies()).set("cart", cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CART_COOKIE_EXPIRATION_TIME,
  });
}
