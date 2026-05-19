import { AdminShell } from "@/components/admin/admin-shell";
import { RateManager } from "@/components/admin/rate-manager";
import { requireAdmin } from "@/lib/auth";
import { getAllProductsForAdmin, getAdminRates } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminRatesPage() {
  await requireAdmin();
  const [products, rates] = await Promise.all([getAllProductsForAdmin(), getAdminRates()]);

  return (
    <AdminShell
      title="Daily rates"
      description="Update coconut count, kilogram rates, and oil litre rates for today."
    >
      <RateManager products={products.filter((product) => product.is_active)} rates={rates} />
    </AdminShell>
  );
}
