import { getProducts } from "@/lib/discovery/product";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import type { RouterOutputs } from "..";

export const productRouter = createTRPCRouter({
  products: publicProcedure.query(() => {
    return getProducts();
  }),
});

export type ProductRouter = typeof productRouter;

export type ProductsOutput = RouterOutputs["product"]["products"];
