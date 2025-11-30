import { AddToCartInputSchema, addToCart } from "@/lib/cart/addToCart";
import { getCart } from "@/lib/cart/getCart";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import type { RouterInputs, RouterOutputs } from "..";

export const cartRouter = createTRPCRouter({
  cart: publicProcedure.query(() => {
    return getCart();
  }),
  addToCart: publicProcedure
    .input(AddToCartInputSchema)
    .mutation(({ input }) => {
      return addToCart(input);
    }),
});

export type CartRouter = typeof cartRouter;

export type AddToCartInput = RouterInputs["cart"]["addToCart"];

export type AddToCartOutput = RouterOutputs["cart"]["addToCart"];
