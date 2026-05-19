import { AdminShell } from "@/components/admin/admin-shell";
import { OrdersTable } from "@/components/admin/orders-table";
import { requireAdmin } from "@/lib/auth";
import { getRecentOrders } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getRecentOrders(100);

  return (
    <AdminShell
      title="Orders"
      description="Confirm orders, pack stock, update delivery progress, and keep customer notes."
    >
      <OrdersTable orders={orders} />
    </AdminShell>
  );
}
