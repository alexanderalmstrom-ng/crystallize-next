"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { type ComponentProps, useActionState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { updateCartQuantity } from "./MiniCart.actions";

type MiniCartQuantityFormProps = ComponentProps<"div"> & {
  sku: string;
  quantity: number;
};

export default function MiniCartQuantityForm({
  sku,
  quantity,
  className,
  ...props
}: MiniCartQuantityFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateCartQuantity.bind(null, sku),
    {
      quantity,
    },
  );

  if (!sku) {
    return null;
  }

  const currentQuantity = isPending ? state.quantity : quantity;

  return (
    <div
      className={cn("flex flex-row gap-2 mt-2 items-center", className)}
      {...props}
    >
      <form action={formAction}>
        <input type="hidden" name="action" value="decrement" />
        <Button
          variant="secondary"
          size="icon-sm"
          disabled={isPending || currentQuantity === 1}
          type="submit"
        >
          <MinusIcon className="size-3" strokeWidth={1.5} />
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
          <PlusIcon className="size-3" strokeWidth={1.5} />
        </Button>
      </form>
    </div>
  );
}
