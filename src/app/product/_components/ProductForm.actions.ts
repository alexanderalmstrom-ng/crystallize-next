"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import { AddToCartInputSchema } from "@/lib/cart/addToCart";
import { caller } from "@/trpc/server";

export async function addToCartAction(
  // biome-ignore lint/correctness/noUnusedFunctionParameters: We need to pass the initial state to the action
  initialState: unknown,
  formData: FormData,
) {
  const validation = AddToCartInputSchema.safeParse({
    items: [
      {
        sku: formData.get("sku"),
        quantity: Number(formData.get("quantity")),
      },
    ],
  });

  if (!validation.success) {
    return {
      error: z.treeifyError(validation.error),
    };
  }

  const addToCartResponse = await caller.cart.addToCart({
    items: validation.data.items,
  });

  revalidatePath("/");

  return addToCartResponse;
}
