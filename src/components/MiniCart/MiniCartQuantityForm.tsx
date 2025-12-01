"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useActionState } from "react";
import { Button } from "../ui/button";
import { updateCartQuantity } from "./MiniCart.actions";

export default function MiniCartQuantityForm({
  sku,
  quantity,
}: {
  sku?: string | null;
  quantity: number;
}) {
  const [state, formAction, isPending] = useActionState(
    updateCartQuantity.bind(null, sku),
    {
      quantity,
    },
  );

  if (!sku) {
    return null;
  }

  // Use the state from useActionState to show optimistic updates
  const currentQuantity = state?.quantity ?? quantity;

  return (
    <div className="flex flex-row gap-2 mt-2 items-center">
      <form action={formAction}>
        <input type="hidden" name="action" value="decrement" />
        <Button
          variant="secondary"
          size="icon-sm"
          disabled={isPending}
          type="submit"
        >
          <MinusIcon className="size-2" strokeWidth={1.5} />
        </Button>
      </form>
      <span className="text-sm">{currentQuantity}</span>
      <form action={formAction}>
        <input type="hidden" name="action" value="increment" />
        <Button
          variant="secondary"
          size="icon-sm"
          disabled={isPending}
          type="submit"
        >
          <PlusIcon className="size-2" strokeWidth={1.5} />
        </Button>
      </form>
    </div>
  );
}
