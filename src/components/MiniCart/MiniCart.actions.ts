"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import { UpdateCartInputSchema, updateCart } from "@/lib/cart/updateCart";

function decrementQuantity(state: { quantity: number }) {
  return { quantity: state.quantity - 1 };
}
function incrementQuantity(state: { quantity: number }) {
  return { quantity: state.quantity + 1 };
}

export async function updateCartQuantity(
  sku: string | null | undefined,
  initialState: { quantity: number },
  formData: FormData,
) {
  const action = formData.get("action") as "decrement" | "increment";

  const newState =
    action === "decrement"
      ? decrementQuantity(initialState)
      : incrementQuantity(initialState);

  const validation = UpdateCartInputSchema.safeParse({
    items: [
      {
        sku,
        quantity: newState.quantity,
      },
    ],
  });

  if (!validation.success) {
    return {
      error: z.treeifyError(validation.error),
      quantity: initialState.quantity,
    };
  }

  try {
    await updateCart({
      items: validation.data.items,
    });

    revalidatePath("/");

    return {
      quantity: newState.quantity,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update cart",
      quantity: initialState.quantity,
    };
  }
}
