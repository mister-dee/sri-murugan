import { updateRateAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney, formatUnit } from "@/lib/format";
import type { DailyRate, Product } from "@/lib/types";

export function RateManager({ products, rates }: { products: Product[]; rates: DailyRate[] }) {
  return (
    <div className="grid gap-3">
      {products.map((product) =>
        product.unit_options.map((unit) => {
          const rate = rates.find((item) => item.product_id === product.id && item.unit === unit);

          return (
            <form
              key={`${product.id}-${unit}`}
              action={updateRateAction}
              className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm md:grid-cols-[1fr_150px_1fr_auto] md:items-end"
            >
              <input type="hidden" name="product_id" value={product.id} />
              <input type="hidden" name="unit" value={unit} />
              <div>
                <p className="font-bold">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  Current {rate ? formatMoney(rate.rate_in_paise) : formatMoney(product.price_in_paise)} per{" "}
                  {formatUnit(unit)}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${product.id}-${unit}-rate`}>Rate</Label>
                <Input
                  id={`${product.id}-${unit}-rate`}
                  name="rate_rupees"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={((rate?.rate_in_paise ?? product.price_in_paise) / 100).toString()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${product.id}-${unit}-notes`}>Notes</Label>
                <Input
                  id={`${product.id}-${unit}-notes`}
                  name="notes"
                  defaultValue={rate?.notes ?? ""}
                  placeholder="Market note"
                />
              </div>
              <Button type="submit">Save rate</Button>
            </form>
          );
        })
      )}
    </div>
  );
}
