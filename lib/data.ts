import "server-only";

import { businessConfig, isSupabaseConfigured } from "@/lib/config";
import { fallbackProducts, fallbackRates, fallbackShopStatus } from "@/lib/fallback-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { DailyRate, Product, ProductCategory, ProductUnit, ShopStatus } from "@/lib/types";

type ProductRow = Omit<Product, "unit_options" | "category"> & {
  category: ProductCategory;
  unit_options: ProductUnit[] | null;
};

type DailyRateRow = {
  id: string;
  product_id: string;
  unit: ProductUnit;
  rate_in_paise: number;
  effective_date: string;
  notes: string | null;
  products:
    | {
        name: string;
        tamil_name: string | null;
        slug: string;
        category: ProductCategory;
      }
    | {
        name: string;
        tamil_name: string | null;
        slug: string;
        category: ProductCategory;
      }[]
    | null;
};

type ShopSettingsRow = {
  id: string;
  shop_name: string;
  is_open: boolean;
  status_message: string;
  opens_at: string | null;
  closes_at: string | null;
  pickup_address: string | null;
  whatsapp_phone: string | null;
  updated_at: string;
};

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return fallbackProducts;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return fallbackProducts;

  return (data as ProductRow[]).map((product) => ({
    ...product,
    unit_options: product.unit_options ?? ["piece"]
  }));
}

export async function getDailyRates(): Promise<DailyRate[]> {
  if (!isSupabaseConfigured()) return fallbackRates;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("daily_rates")
    .select(
      "id, product_id, unit, rate_in_paise, effective_date, notes, products(name, tamil_name, slug, category)"
    )
    .order("effective_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) return fallbackRates;

  const seen = new Set<string>();
  const rates: DailyRate[] = [];

  for (const row of data as DailyRateRow[]) {
    const product = Array.isArray(row.products) ? row.products[0] : row.products;
    if (!product) continue;

    const key = `${row.product_id}:${row.unit}`;
    if (seen.has(key)) continue;
    seen.add(key);

    rates.push({
      id: row.id,
      product_id: row.product_id,
      product_name: product.name,
      product_tamil_name: product.tamil_name,
      product_slug: product.slug,
      category: product.category,
      unit: row.unit,
      rate_in_paise: row.rate_in_paise,
      effective_date: row.effective_date,
      notes: row.notes
    });
  }

  return rates.length > 0 ? rates : fallbackRates;
}

export async function getShopStatus(): Promise<ShopStatus> {
  if (!isSupabaseConfigured()) return fallbackShopStatus;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("shop_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (error || !data) return fallbackShopStatus;

  const settings = data as ShopSettingsRow;

  return {
    id: settings.id,
    shop_name: settings.shop_name || businessConfig.name,
    is_open: settings.is_open,
    status_message: settings.status_message,
    opens_at: settings.opens_at,
    closes_at: settings.closes_at,
    pickup_address: settings.pickup_address ?? businessConfig.address,
    whatsapp_phone: settings.whatsapp_phone ?? businessConfig.whatsappPhone,
    updated_at: settings.updated_at
  };
}

export async function getHomepageData() {
  const [products, rates, shopStatus] = await Promise.all([
    getProducts(),
    getDailyRates(),
    getShopStatus()
  ]);

  return { products, rates, shopStatus };
}

export function rateForProductUnit(
  rates: DailyRate[],
  product: Product,
  unit: ProductUnit
) {
  return (
    rates.find((rate) => rate.product_id === product.id && rate.unit === unit)?.rate_in_paise ??
    product.price_in_paise
  );
}
