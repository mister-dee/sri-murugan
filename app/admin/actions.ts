"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { OrderStatus, ProductCategory, ProductUnit } from "@/lib/types";

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return;

  const orderId = String(formData.get("order_id") ?? "");
  const status = String(formData.get("status") ?? "new") as OrderStatus;
  const adminNotes = String(formData.get("admin_notes") ?? "").trim();

  const supabase = createSupabaseAdminClient();
  await supabase
    .from("orders")
    .update({
      status,
      admin_notes: adminNotes || null,
      updated_at: new Date().toISOString()
    })
    .eq("id", orderId);

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}

export async function updateRateAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!isSupabaseConfigured()) return;

  const productId = String(formData.get("product_id") ?? "");
  const unit = String(formData.get("unit") ?? "piece") as ProductUnit;
  const rateRupees = Number(formData.get("rate_rupees") ?? 0);
  const notes = String(formData.get("notes") ?? "").trim();

  const supabase = createSupabaseAdminClient();
  await supabase.from("daily_rates").upsert(
    {
      product_id: productId,
      effective_date: new Date().toISOString().slice(0, 10),
      unit,
      rate_in_paise: Math.round(rateRupees * 100),
      notes: notes || null,
      created_by: admin.id
    },
    { onConflict: "product_id,effective_date,unit" }
  );

  revalidatePath("/");
  revalidatePath("/qr");
  revalidatePath("/admin/rates");
}

export async function updateShopStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!isSupabaseConfigured()) return;

  const supabase = createSupabaseAdminClient();
  await supabase.from("shop_settings").upsert({
    id: "default",
    shop_name: "Sri Murugan Coconut Wholesale",
    is_open: formData.get("is_open") === "on",
    status_message: String(formData.get("status_message") ?? "").trim(),
    opens_at: String(formData.get("opens_at") ?? "") || null,
    closes_at: String(formData.get("closes_at") ?? "") || null,
    pickup_address: String(formData.get("pickup_address") ?? "").trim(),
    whatsapp_phone: String(formData.get("whatsapp_phone") ?? "").trim(),
    updated_by: admin.id,
    updated_at: new Date().toISOString()
  });

  revalidatePath("/");
  revalidatePath("/qr");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return;

  const productId = String(formData.get("product_id") ?? "");
  const unitOptions = formData.getAll("unit_options").map(String) as ProductUnit[];
  const priceRupees = Number(formData.get("price_rupees") ?? 0);

  const supabase = createSupabaseAdminClient();
  await supabase
    .from("products")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      tamil_name: String(formData.get("tamil_name") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      category: String(formData.get("category") ?? "coconut") as ProductCategory,
      unit_options: unitOptions.length > 0 ? unitOptions : ["piece"],
      price_in_paise: Math.round(priceRupees * 100),
      is_active: formData.get("is_active") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0),
      updated_at: new Date().toISOString()
    })
    .eq("id", productId);

  revalidatePath("/");
  revalidatePath("/qr");
  revalidatePath("/admin/products");
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return;

  const unitOptions = formData.getAll("unit_options").map(String) as ProductUnit[];
  const name = String(formData.get("name") ?? "").trim();
  const priceRupees = Number(formData.get("price_rupees") ?? 0);

  const supabase = createSupabaseAdminClient();
  await supabase.from("products").insert({
    slug: slugify(name),
    name,
    tamil_name: String(formData.get("tamil_name") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    category: String(formData.get("category") ?? "coconut") as ProductCategory,
    unit_options: unitOptions.length > 0 ? unitOptions : ["piece"],
    price_in_paise: Math.round(priceRupees * 100),
    is_active: true,
    sort_order: Number(formData.get("sort_order") ?? 99)
  });

  revalidatePath("/");
  revalidatePath("/qr");
  revalidatePath("/admin/products");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
