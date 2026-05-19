import { businessConfig } from "@/lib/config";
import { formatMoney, formatUnit } from "@/lib/format";
import type { OrderPayload } from "@/lib/types";

type MessageInput = {
  payload: OrderPayload;
  orderReference: string;
  totalInPaise: number;
};

export function createWhatsAppOrderMessage({
  payload,
  orderReference,
  totalInPaise
}: MessageInput) {
  const itemLines = payload.items
    .map((item) => {
      const quantity =
        item.unit === "piece" ? `${item.quantity}` : `${item.quantity} ${formatUnit(item.unit)}`;
      const lineTotal = Math.round(item.quantity * item.rateInPaise);
      return `- ${item.productName}: ${quantity} @ ${formatMoney(item.rateInPaise)} = ${formatMoney(
        lineTotal
      )}`;
    })
    .join("\n");

  const fulfillment =
    payload.fulfillmentType === "delivery"
      ? `Delivery\nAddress: ${payload.deliveryAddress}`
      : "Pickup from shop";

  return [
    `Vanakkam ${businessConfig.name},`,
    `Order Ref: ${orderReference}`,
    "",
    itemLines,
    "",
    `Total: ${formatMoney(totalInPaise)}`,
    `Customer: ${payload.customerName}`,
    `Phone: ${payload.customerPhone}`,
    `Mode: ${fulfillment}`,
    `Preferred time: ${payload.preferredDeliverySlot}`
  ].join("\n");
}

export function createWhatsAppUrl(message: string, phone = businessConfig.whatsappPhone) {
  const sanitizedPhone = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
}

export function generateOrderReference() {
  const date = new Date();
  const day = date.toISOString().slice(2, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SMC-${day}-${random}`;
}
