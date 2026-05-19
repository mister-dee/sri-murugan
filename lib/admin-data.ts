import "server-only";

import { isSupabaseConfigured } from "@/lib/config";
import { fallbackProducts, fallbackRates } from "@/lib/fallback-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AdminMetrics, OrderSummary, Product } from "@/lib/types";

export async function getAdminMetrics(): Promise<AdminMetrics> {
  if (!isSupabaseConfigured()) {
    return {
      todayOrders: 0,
      pendingOrders: 0,
      todayRevenueInPaise: 0,
      activeProducts: fallbackProducts.length
    };
  }

  const supabase = createSupabaseAdminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayOrders, pendingOrders, todayRevenue, activeProducts] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", today.toISOString()),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("status", ["new", "confirmed", "packed"]),
    supabase.from("orders").select("total_in_paise").gte("created_at", today.toISOString()),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
  ]);

  return {
    todayOrders: todayOrders.count ?? 0,
    pendingOrders: pendingOrders.count ?? 0,
    todayRevenueInPaise:
      todayRevenue.data?.reduce(
        (sum, order) => sum + Number(order.total_in_paise ?? 0),
        0
      ) ?? 0,
    activeProducts: activeProducts.count ?? 0
  };
}

export async function getRecentOrders(limit = 40): Promise<OrderSummary[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as OrderSummary[];
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return fallbackProducts;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return fallbackProducts;
  return data as Product[];
}

export async function getAdminRates() {
  if (!isSupabaseConfigured()) return fallbackRates;

  const { getDailyRates } = await import("@/lib/data");
  return getDailyRates();
}
