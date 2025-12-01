"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import { getFragmentData } from "@/gql/cart";
import { productVariantFragment } from "@/lib/cart/fragments/productVariant";
import { getCart } from "@/lib/cart/getCart";
import { UpdateCartInputSchema, updateCart } from "@/lib/cart/updateCart";

function decrementQuantity(state: { quantity: number }) {
  return { quantity: state.quantity - 1 };
}
function incrementQuantity(state: { quantity: number }) {
  return { quantity: state.quantity + 1 };
}

export async function updateCartQuantity(
  sku: string,
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

  const currentCart = await getCart();

  const updatedCartItems =
    currentCart?.items.map((item) => {
      const itemSku = z
        .string()
        .parse(getFragmentData(productVariantFragment, item.variant)?.sku);
      const itemQuantity = z.number().parse(item.quantity);

      if (itemSku === sku) {
        return {
          sku,
          quantity: newState.quantity,
        };
      }

      return {
        sku: itemSku,
        quantity: itemQuantity,
      };
    }) ?? [];

  const skuIsInCart = updatedCartItems.some((item) => item.sku === sku);

  if (!skuIsInCart) {
    updatedCartItems.push({
      sku,
      quantity: newState.quantity,
    });
  }

  try {
    await updateCart({
      items: updatedCartItems,
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
