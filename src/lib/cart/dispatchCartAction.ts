import z from "zod";
import { addSkuItemToCart } from "./addSkuItem";
import type { AddToCartInputSchema } from "./addToCart";
import { getCart } from "./getCart";
import { hydrateCart } from "./hydrateCart";
import { setCartCookie } from "./setCartCookie";

export async function dispatchCartAction(
  items: z.infer<typeof AddToCartInputSchema>["items"],
  action: "add" | "update" = "add",
) {
  const cart = await getCart();

  if (!cart) {
    const newCart = await hydrateCart({
      items,
    });

    const cartIdValidation = z.string().safeParse(newCart?.id);

    if (!cartIdValidation.success) {
      throw new Error("Invalid cart ID");
    }

    await setCartCookie(cartIdValidation.data);

    return newCart;
  }

  if (action === "update") {
    const updatedCart = await hydrateCart({
      id: cart.id,
      items,
    });
    return updatedCart;
  }

  if (action === "add") {
    const addSkuItemCart = await addSkuItemToCart(cart.id, items);
    return addSkuItemCart;
  }

  throw new Error("Invalid cart action");
}
