import type { ReactNode } from "react";

export default function MiniCartContent({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-px">{children}</div>;
}
