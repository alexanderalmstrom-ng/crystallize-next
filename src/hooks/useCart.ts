import { useQuery } from "@tanstack/react-query";
import { useTRPCClient } from "@/trpc/client";

export default function useCart() {
  const trpc = useTRPCClient();

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => await trpc.cart.cart.query(),
  });
}
