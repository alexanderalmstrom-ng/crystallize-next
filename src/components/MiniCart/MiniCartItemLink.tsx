"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useMiniCartStore } from "./MiniCart.store";

export default function MiniCartItemLink({
  children,
  href,
  ...props
}: ComponentProps<typeof Link>) {
  const setMiniCartOpen = useMiniCartStore((state) => state.setOpen);

  return (
    <Link href={href} onNavigate={() => setMiniCartOpen(false)} {...props}>
      {children}
    </Link>
  );
}
