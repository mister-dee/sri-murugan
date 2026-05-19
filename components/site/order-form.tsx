"use client";

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Loader2, MessageCircle, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatMoney, formatUnit } from "@/lib/format";
import type { DailyRate, FulfillmentType, OrderItemInput, Product, ProductUnit } from "@/lib/types";
import { cn } from "@/lib/utils";

type OrderFormProps = {
  products: Product[];
  rates: DailyRate[];
  source?: "homepage" | "qr";
  compact?: boolean;
};

type OrderResult = {
  orderReference: string;
  whatsappUrl: string;
  totalInPaise: number;
};

const deliverySlots = [
  "Today before 10 AM",
  "Today 10 AM - 1 PM",
  "Today 1 PM - 5 PM",
  "Today 5 PM - 8 PM",
  "Tomorrow morning"
];

export function OrderForm({
  products,
  rates,
  source = "homepage",
  compact = false
}: OrderFormProps) {
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [preferredDeliverySlot, setPreferredDeliverySlot] = useState(deliverySlots[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResult | null>(null);

  const rateLookup = useMemo(() => {
    const lookup = new Map<string, number>();
    rates.forEach((rate) => lookup.set(`${rate.product_id}:${rate.unit}`, rate.rate_in_paise));
    return lookup;
  }, [rates]);

  const selectedItems = useMemo<OrderItemInput[]>(() => {
    return products.flatMap((product) =>
      product.unit_options.flatMap((unit) => {
        const quantity = Number(quantities[itemKey(product.id, unit)] ?? 0);
        if (!Number.isFinite(quantity) || quantity <= 0) return [];

        return {
          productId: product.id,
          productName: product.name,
          unit,
          quantity,
          rateInPaise: rateLookup.get(`${product.id}:${unit}`) ?? product.price_in_paise
        };
      })
    );
  }, [products, quantities, rateLookup]);

  const deliveryFeeInPaise = fulfillmentType === "delivery" ? 3000 : 0;
  const subtotalInPaise = selectedItems.reduce(
    (sum, item) => sum + Math.round(item.quantity * item.rateInPaise),
    0
  );
  const totalInPaise = subtotalInPaise + deliveryFeeInPaise;

  function updateQuantity(productId: string, unit: ProductUnit, value: string) {
    setResult(null);
    setQuantities((current) => ({
      ...current,
      [itemKey(productId, unit)]: value
    }));
  }

  function stepQuantity(productId: string, unit: ProductUnit, delta: number) {
    const key = itemKey(productId, unit);
    const current = Number(quantities[key] ?? 0);
    const step = unit === "piece" ? 10 : 1;
    const next = Math.max(0, current + delta * step);
    updateQuantity(productId, unit, next === 0 ? "" : String(next));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (selectedItems.length === 0) {
      setError("Add at least one coconut or oil item.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          fulfillmentType,
          deliveryAddress,
          preferredDeliverySlot,
          source,
          items: selectedItems
        })
      });

      const payload = (await response.json()) as OrderResult & { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Unable to place order. Please call the shop.");
        return;
      }

      setResult(payload);
    } catch {
      setError("Network issue while placing the order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form id="order" onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Wholesale order
          </p>
          <h2 className={cn("font-black tracking-normal", compact ? "text-xl" : "text-2xl")}>
            Select coconuts and oils
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="secondary" className="text-sm font-bold text-primary">
            Total {formatMoney(totalInPaise)}
          </Badge>
          {deliveryFeeInPaise > 0 ? (
            <p className="mt-1 text-xs font-semibold text-muted-foreground/80">
              Includes {formatMoney(deliveryFeeInPaise)} delivery
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3">
        {products.map((product) => (
          <ProductOrderRow
            key={product.id}
            product={product}
            rateLookup={rateLookup}
            quantities={quantities}
            onChange={updateQuantity}
            onStep={stepQuantity}
          />
        ))}
      </div>

      <div className="grid gap-4 rounded-lg glass-panel p-4 md:grid-cols-2 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer name</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Shop, hotel, or buyer name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">Mobile number</Label>
          <Input
            id="customerPhone"
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            placeholder="+91"
            inputMode="tel"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Delivery or pickup</Label>
          <div className="grid grid-cols-2 gap-2">
            <ModeButton
              active={fulfillmentType === "delivery"}
              onClick={() => setFulfillmentType("delivery")}
              icon={<Truck className="h-4 w-4" />}
              label="Delivery"
            />
            <ModeButton
              active={fulfillmentType === "pickup"}
              onClick={() => setFulfillmentType("pickup")}
              icon={<ShoppingBag className="h-4 w-4" />}
              label="Pickup"
            />
          </div>
        </div>

        {fulfillmentType === "delivery" ? (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="deliveryAddress">Delivery address</Label>
            <Textarea
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              placeholder="Area, street, landmark"
              required
            />
          </div>
        ) : null}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="preferredDeliverySlot">Preferred time</Label>
          <Select
            id="preferredDeliverySlot"
            value={preferredDeliverySlot}
            onChange={(event) => setPreferredDeliverySlot(event.target.value)}
          >
            {deliverySlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="grid gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
          <p className="font-bold">Order saved: {result.orderReference}</p>
          <p className="text-sm">
            Total {formatMoney(result.totalInPaise)}. Send the prepared message to the shop on
            WhatsApp to confirm dispatch.
          </p>
          <Button asChild variant="whatsapp" size="lg">
            <a href={result.whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="h-5 w-5" />
              Send on WhatsApp
            </a>
          </Button>
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
        Place order and prepare WhatsApp
      </Button>
    </form>
  );
}

function ProductOrderRow({
  product,
  rateLookup,
  quantities,
  onChange,
  onStep
}: {
  product: Product;
  rateLookup: Map<string, number>;
  quantities: Record<string, string>;
  onChange: (productId: string, unit: ProductUnit, value: string) => void;
  onStep: (productId: string, unit: ProductUnit, delta: number) => void;
}) {
  return (
    <div className="rounded-lg glass-panel p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-bold">{product.name}</h3>
          {product.tamil_name ? (
            <p className="font-[var(--font-tamil)] text-xs text-muted-foreground">
              {product.tamil_name}
            </p>
          ) : null}
          {product.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
          ) : null}
        </div>
        <Badge variant={product.category === "coconut" ? "success" : "warning"}>
          {product.category}
        </Badge>
      </div>

      <div className="grid gap-2">
        {product.unit_options.map((unit) => {
          const key = itemKey(product.id, unit);
          const rate = rateLookup.get(`${product.id}:${unit}`) ?? product.price_in_paise;

          return (
            <div key={unit} className="grid grid-cols-[1fr_148px] items-center gap-3">
              <div>
                <p className="text-sm font-semibold">{formatMoney(rate)}</p>
                <p className="text-xs text-muted-foreground">per {formatUnit(unit)}</p>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Decrease ${product.name} ${unit}`}
                  onClick={() => onStep(product.id, unit, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  value={quantities[key] ?? ""}
                  onChange={(event) => onChange(product.id, unit, event.target.value)}
                  inputMode="decimal"
                  type="number"
                  min="0"
                  step={unit === "piece" ? "1" : "0.5"}
                  placeholder={unit}
                  aria-label={`${product.name} quantity in ${unit}`}
                  className="h-10 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Increase ${product.name} ${unit}`}
                  onClick={() => onStep(product.id, unit, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-12 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background hover:bg-muted"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function itemKey(productId: string, unit: ProductUnit) {
  return `${productId}:${unit}`;
}
