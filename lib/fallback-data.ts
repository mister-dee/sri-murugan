import { businessConfig } from "@/lib/config";
import type { DailyRate, Product, ShopStatus } from "@/lib/types";

export const fallbackProducts: Product[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    slug: "coconut-medium",
    name: "Coconut (Medium)",
    tamil_name: "நடுத்தர தேங்காய்",
    description: "Medium-sized market coconuts.",
    category: "coconut",
    unit_options: ["piece"],
    price_in_paise: 3500,
    is_active: true,
    sort_order: 1
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    slug: "coconut-large",
    name: "Coconut (Large)",
    tamil_name: "பெரிய தேங்காய்",
    description: "Large-sized premium coconuts.",
    category: "coconut",
    unit_options: ["piece"],
    price_in_paise: 4000,
    is_active: true,
    sort_order: 2
  },
  {
    id: "00000000-0000-0000-0000-000000000103",
    slug: "coconut-by-weight",
    name: "Coconut (By Weight)",
    tamil_name: "தேங்காய் (கிலோ)",
    description: "Unsorted bulk coconuts weighed per kilogram.",
    category: "coconut",
    unit_options: ["kg"],
    price_in_paise: 5700,
    is_active: true,
    sort_order: 3
  },
  {
    id: "00000000-0000-0000-0000-000000000201",
    slug: "coconut-oil",
    name: "Coconut Oil",
    tamil_name: "தேங்காய் எண்ணெய்",
    description: "Wholesale coconut oil for cooking and retail refill.",
    category: "oil",
    unit_options: ["litre"],
    price_in_paise: 19500,
    is_active: true,
    sort_order: 2
  },
  {
    id: "00000000-0000-0000-0000-000000000202",
    slug: "groundnut-oil",
    name: "Groundnut Oil",
    tamil_name: "கடலை எண்ணெய்",
    description: "Bulk groundnut oil with reliable daily supply.",
    category: "oil",
    unit_options: ["litre"],
    price_in_paise: 24500,
    is_active: true,
    sort_order: 3
  },
  {
    id: "00000000-0000-0000-0000-000000000203",
    slug: "sesame-oil",
    name: "Sesame Oil",
    tamil_name: "நல்லெண்ணெய்",
    description: "Sesame oil for wholesale and local shop orders.",
    category: "oil",
    unit_options: ["litre"],
    price_in_paise: 31000,
    is_active: true,
    sort_order: 4
  }
];

export const fallbackRates: DailyRate[] = fallbackProducts.flatMap((product) =>
  product.unit_options.map((unit, index) => ({
    id: `${product.id}-${unit}`,
    product_id: product.id,
    product_name: product.name,
    product_tamil_name: product.tamil_name,
    product_slug: product.slug,
    category: product.category,
    unit,
    rate_in_paise: product.price_in_paise,
    effective_date: new Date().toISOString().slice(0, 10),
    notes: index === 0 && product.category === "coconut" ? "Market rate changes daily" : null
  }))
);

export const fallbackShopStatus: ShopStatus = {
  shop_name: businessConfig.name,
  is_open: true,
  status_message: "Open for wholesale orders today",
  opens_at: "05:30:00",
  closes_at: "20:30:00",
  pickup_address: businessConfig.address,
  whatsapp_phone: businessConfig.whatsappPhone
};
