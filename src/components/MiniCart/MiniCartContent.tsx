import type { ReactNode } from "react";

export default function MiniCartContent({ children }: { children: ReactNode }) {
  return <div className="p-4 flex flex-col gap-4">{children}</div>;
}
