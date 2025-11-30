import { getFragmentData, graphql } from "@/gql/discovery";
import { normalizeSlug } from "@/utils/common";
import { crystallizeDiscovery } from "../crystallize/client";
import { productFragment } from "./fragments/product.fragment";

export const getProductsServerFn = async () => {
  const products = await crystallizeDiscovery({
    query: graphql(`
      query GetProducts {
        browse {
          product {
            hits {
              id
              name
              path
            }
          }
        }
      }
    `),
  });

  return products?.data?.browse?.product?.hits;
};

export const getProductByPath = async ({ path }: { path: string }) => {
  const product = await crystallizeDiscovery({
    variables: { path: normalizeSlug(path) },
    query: graphql(`
          query GetProductByPath($path: String!) {
            browse {
              product(path: $path) {
                hits {
                  ...product
                }
              }
            }
          }
        `),
  });

  return getFragmentData(
    productFragment,
    product?.data?.browse?.product?.hits?.[0],
  );
};
