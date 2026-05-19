export type ProductCategory = "coconut" | "oil";

export type ProductUnit = "piece" | "kg" | "litre";

export type FulfillmentType = "delivery" | "pickup";

export type OrderStatus =
  | "new"
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type Product = {
  id: string;
  slug: string;
  name: string;
  tamil_name: string | null;
  description: string | null;
  category: ProductCategory;
  unit_options: ProductUnit[];
  price_in_paise: number;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type DailyRate = {
  id: string;
  product_id: string;
  product_name: string;
  product_tamil_name: string | null;
  product_slug: string;
  category: ProductCategory;
  unit: ProductUnit;
  rate_in_paise: number;
  effective_date: string;
  notes: string | null;
};

export type ShopStatus = {
  id?: string;
  shop_name: string;
  is_open: boolean;
  status_message: string;
  opens_at: string | null;
  closes_at: string | null;
  pickup_address: string;
  whatsapp_phone: string;
  updated_at?: string;
};

export type OrderItemInput = {
  productId: string;
  productName: string;
  unit: ProductUnit;
  quantity: number;
  rateInPaise: number;
  notes?: string;
};

export type OrderPayload = {
  customerName: string;
  customerPhone: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  preferredDeliverySlot: string;
  source: "homepage" | "qr";
  items: OrderItemInput[];
};

export type OrderSummary = {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_phone: string;
  fulfillment_type: FulfillmentType;
  delivery_address: string | null;
  preferred_delivery_slot: string;
  status: OrderStatus;
  subtotal_in_paise: number;
  delivery_fee_in_paise: number;
  total_in_paise: number;
  whatsapp_message: string | null;
  source: string;
  admin_notes: string | null;
  created_at: string;
  order_items?: OrderItemRecord[];
};

export type OrderItemRecord = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit: ProductUnit;
  quantity: number;
  rate_in_paise: number;
  line_total_in_paise: number;
  notes: string | null;
};

export type AdminMetrics = {
  todayOrders: number;
  pendingOrders: number;
  todayRevenueInPaise: number;
  activeProducts: number;
};
