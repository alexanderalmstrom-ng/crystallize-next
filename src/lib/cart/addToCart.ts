"use server";

import z from "zod";
import { getAuthToken } from "../auth";

const AddToCartInputSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string(),
      quantity: z.number().default(1),
    }),
  ),
});

// biome-ignore lint/correctness/noUnusedFunctionParameters: We need the initial state for the useActionState hook
export async function addToCart(initialState: unknown, formData: FormData) {
  const authToken = await getAuthToken();

  const validation = AddToCartInputSchema.safeParse({
    items: [
      {
        sku: formData.get("sku"),
        quantity: formData.get("quantity"),
      },
    ],
  });

  if (!validation.success) {
    return {
      error: z.treeifyError(validation.error),
    };
  }

  console.log("validation.data", validation.data);

  return {
    authToken: authToken.token,
  };
}
