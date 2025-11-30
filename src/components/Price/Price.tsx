import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/price";

export default function Price({
  amount,
  className,
  ...props
}: Omit<ComponentProps<"p">, "children"> & {
  amount: number | null | undefined;
}) {
  if (!amount) return null;

  const formattedAmount = formatPrice(amount);

  return (
    <p className={cn("text-lg", className)} {...props}>
      {formattedAmount}
    </p>
  );
}
