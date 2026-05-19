import Link from "next/link";
import { LayoutDashboard, Phone } from "lucide-react";
import { businessConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b bg-card/95 backdrop-blur">
      <div className="shop-sign h-2 w-full" />
      <div className="container flex min-h-16 items-center justify-between gap-3 py-3">
        <Link href="/" className="min-w-0">
          <p className="truncate text-base font-black uppercase tracking-wide text-primary sm:text-xl">
            {businessConfig.name}
          </p>
          <p className="font-[var(--font-tamil)] text-xs font-semibold text-muted-foreground sm:text-sm">
            {businessConfig.tamilName}
          </p>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <a href={`tel:${businessConfig.phone.replaceAll(" ", "")}`}>
              <Phone className="h-4 w-4" />
              Call
            </a>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Admin dashboard">
            <Link href="/admin">
              <LayoutDashboard className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
