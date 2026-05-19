import { z } from "zod";

const productUnitSchema = z.enum(["piece", "kg", "litre"]);

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string().min(2).max(120),
  unit: productUnitSchema,
  quantity: z.coerce.number().positive().max(10000),
  rateInPaise: z.coerce.number().int().nonnegative().max(10000000),
  notes: z.string().max(240).optional()
});

export const orderPayloadSchema = z
  .object({
    customerName: z.string().trim().min(2).max(100),
    customerPhone: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]{8,20}$/, "Enter a valid phone number"),
    fulfillmentType: z.enum(["delivery", "pickup"]),
    deliveryAddress: z.string().trim().max(400).optional(),
    preferredDeliverySlot: z.string().trim().min(2).max(80),
    source: z.enum(["homepage", "qr"]).default("homepage"),
    items: z.array(orderItemSchema).min(1, "Add at least one item")
  })
  .superRefine((data, ctx) => {
    if (data.fulfillmentType === "delivery" && !data.deliveryAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Delivery address is required for delivery orders",
        path: ["deliveryAddress"]
      });
    }
  });

export const rateUpdateSchema = z.object({
  productId: z.string().uuid(),
  unit: productUnitSchema,
  rateInPaise: z.coerce.number().int().nonnegative().max(10000000),
  notes: z.string().max(240).optional()
});

export const shopStatusSchema = z.object({
  isOpen: z.coerce.boolean(),
  statusMessage: z.string().trim().min(2).max(160),
  opensAt: z.string().optional(),
  closesAt: z.string().optional(),
  pickupAddress: z.string().trim().min(4).max(400),
  whatsappPhone: z.string().trim().min(8).max(20)
});
