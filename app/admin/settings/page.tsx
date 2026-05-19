import { AdminShell } from "@/components/admin/admin-shell";
import { ShopStatusForm } from "@/components/admin/shop-status-form";
import { requireAdmin } from "@/lib/auth";
import { getShopStatus } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const status = await getShopStatus();

  return (
    <AdminShell
      title="Shop settings"
      description="Toggle open status, pickup address, operating hours, and WhatsApp number."
    >
      <ShopStatusForm status={status} />
    </AdminShell>
  );
}
