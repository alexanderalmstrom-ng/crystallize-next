import z from "zod";
import { dispatchCartAction } from "./dispatchCartAction";

export const AddToCartInputSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string(),
      quantity: z.number().default(1),
    }),
  ),
});

export async function addToCart(input: z.infer<typeof AddToCartInputSchema>) {
  const validation = AddToCartInputSchema.safeParse(input);

  if (!validation.success) {
    return {
      error: z.treeifyError(validation.error),
    };
  }

  try {
    return await dispatchCartAction(validation.data.items, "add");
  } catch (error) {
    console.error("Failed to add item(s) to cart", error);

    return {
      error: "Failed to add item(s) to cart",
    };
  }
}
