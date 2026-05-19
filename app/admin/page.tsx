import { Boxes, IndianRupee, ReceiptText, Timer } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { MetricCard } from "@/components/admin/metric-card";
import { OrdersTable } from "@/components/admin/orders-table";
import { ShopStatusPanel } from "@/components/site/shop-status-panel";
import { requireAdmin } from "@/lib/auth";
import { getAdminMetrics, getRecentOrders } from "@/lib/admin-data";
import { getShopStatus } from "@/lib/data";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [metrics, orders, shopStatus] = await Promise.all([
    getAdminMetrics(),
    getRecentOrders(8),
    getShopStatus()
  ]);

  return (
    <AdminShell
      title="Dashboard"
      description="Track today's orders, revenue, shop status, and pending work."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Today orders"
          value={String(metrics.todayOrders)}
          icon={ReceiptText}
          note="Orders received since midnight"
        />
        <MetricCard
          title="Pending"
          value={String(metrics.pendingOrders)}
          icon={Timer}
          note="New, confirmed, and packed"
        />
        <MetricCard
          title="Today revenue"
          value={formatMoney(metrics.todayRevenueInPaise)}
          icon={IndianRupee}
          note="Gross order value"
        />
        <MetricCard
          title="Active products"
          value={String(metrics.activeProducts)}
          icon={Boxes}
          note="Shown on storefront"
        />
      </div>

      <ShopStatusPanel status={shopStatus} />

      <div className="space-y-3">
        <h2 className="text-xl font-black tracking-normal">Recent orders</h2>
        <OrdersTable orders={orders} />
      </div>
    </AdminShell>
  );
}
