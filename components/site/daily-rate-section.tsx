import { BadgeIndianRupee, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMoney, formatUnit } from "@/lib/format";
import type { DailyRate } from "@/lib/types";

export function DailyRateSection({ rates }: { rates: DailyRate[] }) {
  const coconutRates = rates.filter((rate) => rate.category === "coconut");
  const oilRates = rates.filter((rate) => rate.category === "oil");
  const effectiveDate = rates[0]?.effective_date;

  return (
    <section id="rates" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Daily wholesale rate
          </p>
          <h2 className="text-2xl font-black tracking-normal">Today&apos;s coconut and oil prices</h2>
        </div>
        {effectiveDate ? (
          <Badge variant="outline" className="gap-2 bg-card">
            <CalendarDays className="h-3.5 w-3.5" />
            {effectiveDate}
          </Badge>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <RateGroup title="Coconut" rates={coconutRates} />
        <RateGroup title="Oil section" rates={oilRates} />
      </div>
    </section>
  );
}

function RateGroup({ title, rates }: { title: string; rates: DailyRate[] }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <BadgeIndianRupee className="h-5 w-5 text-primary" />
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="grid gap-2">
        {rates.map((rate) => (
          <div
            key={`${rate.product_id}-${rate.unit}`}
            className="flex items-center justify-between gap-3 rounded-md bg-muted/55 px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">{rate.product_name}</p>
              {rate.product_tamil_name ? (
                <p className="font-[var(--font-tamil)] text-xs text-muted-foreground">
                  {rate.product_tamil_name}
                </p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="font-black text-primary">{formatMoney(rate.rate_in_paise)}</p>
              <p className="text-xs text-muted-foreground">per {formatUnit(rate.unit)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
