import { CART_COOKIE_EXPIRATION_TIME } from "@/utils/auth";

export async function setCartCookie(cartId: string) {
  const { cookies } = await import("next/headers");
  return (await cookies()).set("cart", cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CART_COOKIE_EXPIRATION_TIME,
  });
}
