import { MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { caller } from "@/trpc/server";
import MiniCart from "../MiniCart/MiniCart";
import MiniCartContent from "../MiniCart/MiniCartContent";
import MiniCartItem from "../MiniCart/MiniCartItem";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SiteHeaderLogo from "./SiteHeaderLogo";

export default async function SiteHeader() {
  const cart = await caller.cart.cart();

  return (
    <header className="px-5 py-3.5 xl:px-10 xl:py-8 grid grid-cols-[1fr_auto_1fr] items-center gap-8">
      <Button variant="ghost" className="xl:hidden mr-auto" type="button">
        <MenuIcon className="size-4.5" strokeWidth={1.5} />
      </Button>
      <nav className="flex gap-8 items-center justify-start max-xl:hidden">
        <Link href="/">Products</Link>
        <Link href="/">News</Link>
        <Link href="/">Campaigns</Link>
        <Link href="/">Services</Link>
        <Link href="/">Journal</Link>
      </nav>
      <Link href="/">
        <SiteHeaderLogo className="xl:max-w-44 max-w-32" />
      </Link>
      <div className="ml-auto flex grow">
        <form className="max-xl:hidden flex flex-row items-center">
          <Input
            className="focus:outline-none border-0 min-w-56 placeholder:text-sm rounded-full h-8 pr-2 text-ellipsis"
            type="search"
            name="search"
            placeholder="Search for brands, products..."
          />
          <Button variant="ghost" type="submit">
            <SearchIcon className="size-4.5" strokeWidth={1.5} />
          </Button>
        </form>
        <Button variant="ghost" className="xl:hidden" type="button">
          <SearchIcon className="size-4.5" strokeWidth={1.5} />
        </Button>
        <MiniCart
          total={cart?.items.reduce((acc, item) => acc + item.quantity, 0)}
        >
          <MiniCartContent>
            {cart?.items?.map((item) => (
              <MiniCartItem key={item.name} item={item} />
            ))}
          </MiniCartContent>
        </MiniCart>
      </div>
    </header>
  );
}
