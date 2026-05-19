import { Clock, MapPin, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/format";
import type { ShopStatus } from "@/lib/types";

export function ShopStatusPanel({ status }: { status: ShopStatus }) {
  return (
    <Card className="overflow-hidden border-primary/20 shadow-shop">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Shop status</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{status.status_message}</p>
          </div>
          <Badge variant={status.is_open ? "success" : "warning"}>
            {status.is_open ? "Open now" : "Closed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>
            {formatTime(status.opens_at)} - {formatTime(status.closes_at)}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-primary" />
          <span>{status.pickup_address}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <span>WhatsApp {status.whatsapp_phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}
