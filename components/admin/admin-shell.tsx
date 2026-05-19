import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";

export function AdminShell({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <div className="shop-sign h-2 w-full" />
      <div className="container grid gap-5 py-5 lg:grid-cols-[220px_1fr]">
        <AdminNav />
        <section className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-normal">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Storefront
              </Link>
            </Button>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
