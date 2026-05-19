import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getShopStatus } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { shopStatusSchema } from "@/lib/validators";

export async function GET() {
  const status = await getShopStatus();
  return NextResponse.json({ status });
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const json = await request.json().catch(() => null);
  const parsed = shopStatusSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid shop status details" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { isOpen, statusMessage, opensAt, closesAt, pickupAddress, whatsappPhone } = parsed.data;
  const { error } = await supabase.from("shop_settings").upsert({
    id: "default",
    is_open: isOpen,
    status_message: statusMessage,
    opens_at: opensAt || null,
    closes_at: closesAt || null,
    pickup_address: pickupAddress,
    whatsapp_phone: whatsappPhone,
    updated_by: admin.id,
    updated_at: new Date().toISOString()
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
