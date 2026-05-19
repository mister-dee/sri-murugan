import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getDailyRates } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { rateUpdateSchema } from "@/lib/validators";

export async function GET() {
  const rates = await getDailyRates();
  return NextResponse.json({ rates });
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
  const parsed = rateUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid rate details" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { productId, unit, rateInPaise, notes } = parsed.data;
  const { error } = await supabase.from("daily_rates").upsert(
    {
      product_id: productId,
      effective_date: new Date().toISOString().slice(0, 10),
      unit,
      rate_in_paise: rateInPaise,
      notes: notes || null,
      created_by: admin.id
    },
    { onConflict: "product_id,effective_date,unit" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
