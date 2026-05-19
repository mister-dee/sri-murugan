import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DailyRateSection } from "@/components/site/daily-rate-section";
import { OrderForm } from "@/components/site/order-form";
import { ShopStatusPanel } from "@/components/site/shop-status-panel";
import { businessConfig } from "@/lib/config";
import { getHomepageData } from "@/lib/data";

export const revalidate = 60;

export default async function QrLandingPage() {
  const { products, rates, shopStatus } = await getHomepageData();

  return (
    <main className="min-h-screen">
      <div className="shop-sign h-2 w-full" />
      <div className="mx-auto max-w-xl space-y-5 px-4 py-5">
        <header className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Full site
            </Link>
          </Button>
          <div>
            <p className="font-[var(--font-tamil)] text-sm font-bold text-primary">
              {businessConfig.tamilName}
            </p>
            <h1 className="text-2xl font-black tracking-normal">{businessConfig.name}</h1>
            <a
              href={`tel:${businessConfig.phone.replaceAll(" ", "")}`}
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <Phone className="h-4 w-4" />
              {businessConfig.phone}
            </a>
          </div>
        </header>

        <ShopStatusPanel status={shopStatus} />
        <DailyRateSection rates={rates} />
        <OrderForm products={products} rates={rates} source="qr" compact />
      </div>
    </main>
  );
}
