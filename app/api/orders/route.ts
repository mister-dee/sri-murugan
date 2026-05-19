import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/config";
import { getRecentOrders } from "@/lib/admin-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types";
import { orderPayloadSchema } from "@/lib/validators";
import {
  createWhatsAppOrderMessage,
  createWhatsAppUrl,
  generateOrderReference
} from "@/lib/whatsapp";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getRecentOrders(80);
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add environment variables before accepting orders." },
      { status: 503 }
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = orderPayloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order details", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const payload = parsed.data;
  const subtotalInPaise = payload.items.reduce(
    (sum, item) => sum + Math.round(item.quantity * item.rateInPaise),
    0
  );
  const deliveryFeeInPaise = payload.fulfillmentType === "delivery" ? 3000 : 0;
  const totalInPaise = subtotalInPaise + deliveryFeeInPaise;
  const orderReference = generateOrderReference();
  const whatsappMessage = createWhatsAppOrderMessage({
    payload,
    orderReference,
    totalInPaise
  });

  const supabase = createSupabaseAdminClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_reference: orderReference,
      customer_name: payload.customerName,
      customer_phone: payload.customerPhone,
      fulfillment_type: payload.fulfillmentType,
      delivery_address:
        payload.fulfillmentType === "delivery" ? payload.deliveryAddress ?? null : null,
      preferred_delivery_slot: payload.preferredDeliverySlot,
      status: "new",
      subtotal_in_paise: subtotalInPaise,
      delivery_fee_in_paise: deliveryFeeInPaise,
      total_in_paise: totalInPaise,
      whatsapp_message: whatsappMessage,
      source: payload.source
    })
    .select("id, order_reference")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? "Unable to store order" },
      { status: 500 }
    );
  }

  const items = payload.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    unit: item.unit,
    quantity: item.quantity,
    rate_in_paise: item.rateInPaise,
    line_total_in_paise: Math.round(item.quantity * item.rateInPaise),
    notes: item.notes ?? null
  }));

  const { error: itemError } = await supabase.from("order_items").insert(items);

  if (itemError) {
    await supabase
      .from("orders")
      .update({ status: "cancelled", admin_notes: `Item insert failed: ${itemError.message}` })
      .eq("id", order.id);

    return NextResponse.json({ error: "Unable to store order items" }, { status: 500 });
  }

  return NextResponse.json(
    {
      orderReference: order.order_reference,
      totalInPaise,
      whatsappUrl: createWhatsAppUrl(whatsappMessage)
    },
    { status: 201 }
  );
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as {
    orderId?: string;
    status?: OrderStatus;
    adminNotes?: string;
  } | null;

  if (!body?.orderId || !body.status) {
    return NextResponse.json({ error: "orderId and status are required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({
      status: body.status,
      admin_notes: body.adminNotes ?? null,
      updated_at: new Date().toISOString()
    })
    .eq("id", body.orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
