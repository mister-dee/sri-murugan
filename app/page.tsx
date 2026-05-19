import { OrderForm } from "@/components/site/order-form";
import { fallbackProducts, fallbackRates, fallbackShopStatus } from "@/lib/fallback-data";
import Image from "next/image";
import { MapPin } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative flex h-[50vh] min-h-[350px] w-full flex-col items-center justify-center overflow-hidden">
        <Image
          src="/coconut-market.jpeg"
          alt="Sri Murugan Coconut Wholesale Market"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlays to ensure text readability and blend with the background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="relative z-10 w-full max-w-4xl px-4 text-center">
          <div className="glass-panel mx-auto animate-fade-in-up rounded-2xl p-6 shadow-2xl backdrop-blur-lg sm:p-10">
            <h1 className="bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-4xl font-black tracking-tight text-transparent drop-shadow-sm md:text-5xl lg:text-6xl">
              {fallbackShopStatus.shop_name}
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-foreground/90">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="text-sm font-semibold sm:text-base">
                {fallbackShopStatus.pickup_address}
              </p>
            </div>
            <p className="mt-4 text-lg font-medium text-foreground sm:text-xl">
              {fallbackShopStatus.status_message}
            </p>
          </div>
        </div>
      </section>

      {/* Main Order Content */}
      <section className="container relative z-20 mx-auto -mt-8 max-w-3xl px-4">
        <div className="rounded-2xl border border-white/20 bg-card/95 p-4 shadow-shop backdrop-blur-md sm:p-6 md:p-8">
          <OrderForm
            products={fallbackProducts}
            rates={fallbackRates}
            source="homepage"
          />
        </div>
      </section>
    </main>
  );
}
