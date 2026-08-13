"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="flex flex-col gap-4 mt-8">
          <Link
            href="/trending"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-vermilion transition-colors"
          >
            Trending
          </Link>
          <Link
            href="/seasonal"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-vermilion transition-colors"
          >
            Seasonal
          </Link>
          <Link
            href="/discover"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-vermilion transition-colors"
          >
            Discover
          </Link>
          <Link
            href="/watchlist"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-vermilion transition-colors"
          >
            Watchlist
          </Link>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-vermilion transition-colors"
          >
            Profile
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
