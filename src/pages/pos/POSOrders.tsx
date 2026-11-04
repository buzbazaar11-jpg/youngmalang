import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import POSLayout from "@/components/pos/POSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, FileDown, Search, RefreshCw, Table2 } from "lucide-react";
import { printReceipt, downloadReceiptPdf, downloadCsv, ReceiptOrder, ReceiptItem } from "@/lib/receipt";

interface OrderRow extends ReceiptOrder {
  status: string;
  source: string;
  order_type: string;
  payment_method: string;
}

const STATUSES = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
const money = (n: number) => `Rs. ${Number(n || 0).toLocaleString()}`;

const statusColor = (s: string) =>
  s === "delivered" ? "default" : s === "cancelled" ? "destructive" : "secondary";

export default function POSOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<Record<string, ReceiptItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) {
      toast({ title: "Could not load orders", description: error.message, variant: "destructive" });
    } else {
      const rows = (data as unknown as OrderRow[]) || [];
      setOrders(rows);
      const ids = rows.map((o) => o.id);
      if (ids.length) {
        const { data: its } = await supabase
          .from("order_items")
          .select("order_id,title,quantity,price")
          .in("order_id", ids);
        const map: Record<string, ReceiptItem[]> = {};
        ((its as unknown as (ReceiptItem & { order_id: string })[]) || []).forEach((it) => {
          (map[it.order_id] ||= []).push({ title: it.title, quantity: it.quantity, price: Number(it.price) });
        });
        setItems(map);
      }
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("pos-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const row = payload.new as unknown as OrderRow;
          toast({ title: "🔔 New order received", description: `${row.customer_name || "Customer"} • ${money(row.total)}` });
          playNotificationSound();
        }
        load();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load, toast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (sourceFilter === "all" || (o.source || "web") === sourceFilter) &&
        (statusFilter === "all" || o.status === statusFilter) &&
        (!q ||
          o.id.toLowerCase().includes(q) ||
          (o.customer_name || "").toLowerCase().includes(q) ||
          (o.customer_phone || "").includes(q))
    );
  }, [orders, search, sourceFilter, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status } as never).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast({ title: `Order marked ${status.replace(/_/g, " ")}` });
    }
  };

  const exportCsv = () =>
    downloadCsv(
      `orders-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((o) => ({
        id: o.id,
        date: new Date(o.created_at).toLocaleString(),
        customer: o.customer_name || "",
        phone: o.customer_phone || "",
        source: o.source || "web",
        type: o.order_type || "delivery",
        payment: o.payment_method || "cod",
        status: o.status,
        subtotal: o.subtotal ?? "",
        discount: o.discount_amount ?? "",
        delivery: o.delivery_charges ?? "",
        total: o.total,
        items: (items[o.id] || []).map((i) => `${i.quantity}x ${i.title}`).join(" | "),
      }))
    );

  return (
    <POSLayout title="Orders">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search id, name, phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="web">Website</SelectItem>
              <SelectItem value="pos">POS</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={load} className="gap-2"><RefreshCw className="w-4 h-4" /> Refresh</Button>
          <Button variant="outline" onClick={exportCsv} className="gap-2"><Table2 className="w-4 h-4" /> CSV</Button>
        </div>

        {loading ? (
          <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No orders match these filters.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => (
              <Card key={o.id} className="p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8).toUpperCase()}</span>
                      <Badge variant={(o.source || "web") === "pos" ? "default" : "outline"}>{(o.source || "web").toUpperCase()}</Badge>
                      <Badge variant={statusColor(o.status)}>{o.status.replace(/_/g, " ")}</Badge>
                      <Badge variant="outline">{(o.payment_method || "cod").toUpperCase()}</Badge>
                    </div>
                    <p className="font-semibold mt-1">{o.customer_name || "Walk-in Customer"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString()} • {o.order_type || "delivery"}
                      {o.table_no ? ` • Table ${o.table_no}` : ""}
                      {o.customer_phone ? ` • ${o.customer_phone}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {(items[o.id] || []).map((i) => `${i.quantity}x ${i.title}`).join(", ") || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{money(o.total)}</p>
                    <div className="flex gap-1 mt-2">
                      <Button size="icon" variant="outline" title="Print receipt" onClick={() => printReceipt(o, items[o.id] || [])}>
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" title="Download PDF" onClick={() => downloadReceiptPdf(o, items[o.id] || [])}>
                        <FileDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="w-full sm:w-[190px]">
                    <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </POSLayout>
  );
}
