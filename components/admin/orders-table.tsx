import { updateOrderStatusAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { OrderStatus, OrderSummary } from "@/lib/types";

const statuses: OrderStatus[] = [
  "new",
  "confirmed",
  "packed",
  "out_for_delivery",
  "completed",
  "cancelled"
];

export function OrdersTable({ orders }: { orders: OrderSummary[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        No orders yet. Public orders will appear here after Supabase is configured.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="min-w-[150px]">
                <p className="font-bold">{order.order_reference}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(order.created_at)}</p>
                <Badge variant={order.fulfillment_type === "delivery" ? "success" : "warning"} className="mt-2">
                  {order.fulfillment_type}
                </Badge>
              </TableCell>
              <TableCell className="min-w-[180px]">
                <p className="font-semibold">{order.customer_name}</p>
                <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                <p className="mt-1 text-xs">{order.preferred_delivery_slot}</p>
              </TableCell>
              <TableCell className="min-w-[230px]">
                <div className="grid gap-1 text-xs">
                  {order.order_items?.map((item) => (
                    <p key={item.id}>
                      <span className="font-semibold">{item.product_name}</span> x {item.quantity}{" "}
                      {item.unit}
                    </p>
                  ))}
                </div>
              </TableCell>
              <TableCell className="font-black text-primary">
                {formatMoney(order.total_in_paise)}
              </TableCell>
              <TableCell className="min-w-[250px]">
                <form action={updateOrderStatusAction} className="grid gap-2">
                  <input type="hidden" name="order_id" value={order.id} />
                  <Select name="status" defaultValue={order.status}>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </Select>
                  <Input
                    name="admin_notes"
                    defaultValue={order.admin_notes ?? ""}
                    placeholder="Admin note"
                  />
                  <Button type="submit" size="sm">
                    Update
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
