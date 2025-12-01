import z from "zod";
import { dispatchCartAction } from "./dispatchCartAction";

export const UpdateCartInputSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string(),
      quantity: z.number().default(1),
    }),
  ),
});

export async function updateCart(input: z.infer<typeof UpdateCartInputSchema>) {
  const validation = UpdateCartInputSchema.safeParse(input);

  if (!validation.success) {
    throw new Error("Failed to validate cart input");
  }

  try {
    return await dispatchCartAction(validation.data.items, "update");
  } catch (error) {
    console.error("Failed to update item(s) in cart", error);

    throw new Error("Failed to update item(s) in cart");
  }
}
