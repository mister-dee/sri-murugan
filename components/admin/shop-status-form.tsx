import { updateShopStatusAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ShopStatus } from "@/lib/types";

export function ShopStatusForm({ status }: { status: ShopStatus }) {
  return (
    <form action={updateShopStatusAction} className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm">
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input name="is_open" type="checkbox" defaultChecked={status.is_open} />
        Shop is open
      </label>
      <div className="space-y-2">
        <Label>Status message</Label>
        <Input name="status_message" defaultValue={status.status_message} required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Opening time</Label>
          <Input name="opens_at" type="time" defaultValue={status.opens_at?.slice(0, 5) ?? ""} />
        </div>
        <div className="space-y-2">
          <Label>Closing time</Label>
          <Input name="closes_at" type="time" defaultValue={status.closes_at?.slice(0, 5) ?? ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Pickup address</Label>
        <Textarea name="pickup_address" defaultValue={status.pickup_address} required />
      </div>
      <div className="space-y-2">
        <Label>WhatsApp phone with country code</Label>
        <Input name="whatsapp_phone" defaultValue={status.whatsapp_phone} required />
      </div>
      <Button type="submit">Save shop settings</Button>
    </form>
  );
}
