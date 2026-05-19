import Link from "next/link";
import type { Route } from "next";
import { BarChart3, LogOut, Package, ReceiptText, Settings, Tags } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const navItems: { href: Route; label: string; icon: typeof BarChart3 }[] = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
  { href: "/admin/rates", label: "Rates", icon: Tags },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminNav() {
  return (
    <aside className="rounded-lg border bg-card p-3 shadow-sm lg:sticky lg:top-4 lg:h-fit">
      <div className="mb-3 px-2">
        <p className="text-sm font-black uppercase tracking-wide text-primary">Admin</p>
        <p className="font-[var(--font-tamil)] text-xs text-muted-foreground">
          ஸ்ரீ முருகன்
        </p>
      </div>
      <nav className="grid gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold hover:bg-muted"
            >
              <Icon className="h-4 w-4 text-primary" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="mt-3 border-t pt-3">
        <Button type="submit" variant="outline" className="w-full justify-start">
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </form>
    </aside>
  );
}
