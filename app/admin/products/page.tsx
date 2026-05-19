import { AdminShell } from "@/components/admin/admin-shell";
import { ProductManager } from "@/components/admin/product-manager";
import { requireAdmin } from "@/lib/auth";
import { getAllProductsForAdmin } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAllProductsForAdmin();

  return (
    <AdminShell
      title="Products"
      description="Manage coconut and oil products, units, base rates, and storefront visibility."
    >
      <ProductManager products={products} />
    </AdminShell>
  );
}
