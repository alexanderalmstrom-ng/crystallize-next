"use server";

import z from "zod";
import { graphql } from "@/gql/cart";
import { getAuthToken } from "../auth";
import { crystallizeCart } from "../crystallize/client";
import { createCart, getCart } from "./cart";

const AddToCartInputSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string(),
      quantity: z
        .string()
        .default("1")
        .transform((value) => Number(value)),
    }),
  ),
});

// biome-ignore lint/correctness/noUnusedFunctionParameters: We need the initial state for the useActionState hook
export async function addToCart(initialState: unknown, formData: FormData) {
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

  try {
    return await addItemsToCart(validation.data.items);
  } catch {
    console.error("Failed to add item to cart");
  }
}

const addSkuItemMutation = graphql(`
  mutation AddSkuItem($id: UUID, $input: CartSkuItemInput!) { 
    addSkuItem(id: $id, input: $input) {
      id
    }
  }
`);

async function addItemsToCart(
  items: z.infer<typeof AddToCartInputSchema>["items"],
) {
  const cart = await getCart();

  if (!cart) {
    const newCart = await createCart({
      items,
    });

    return newCart;
  }

  const { decryptedToken } = await getAuthToken();
  const addSkuItem = await crystallizeCart({
    query: addSkuItemMutation,
    variables: {
      id: cart.id,
      input: {
        sku: items[0].sku,
        quantity: items[0].quantity,
      },
    },
    headers: {
      Authorization: `Bearer ${decryptedToken}`,
    },
  });

  return addSkuItem.data?.addSkuItem;
}
