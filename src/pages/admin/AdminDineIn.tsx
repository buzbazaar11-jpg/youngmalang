import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, QrCode, Download, Printer, RefreshCw, ExternalLink } from "lucide-react";

interface TableRow { id: string; table_no: number; name: string; seats: number; code: string | null; active: boolean }
interface Line { id: string; title: string; price: number; quantity: number }
interface DineOrder { id: string; table_no: number; table_name: string; customer_name: string; customer_phone: string | null; notes: string | null; items: Line[]; total: number; status: string; placed_by: string; created_at: string }
interface MenuItem { id: string; title: string; price: number }

const STATUSES = ["pending", "accepted", "preparing", "ready", "served", "completed", "cancelled"];
const NEXT: Record<string, string> = { pending: "accepted", accepted: "preparing", preparing: "ready", ready: "served", served: "completed" };
const tableUrl = (code: string) => `${window.location.origin}/table/${code}`;
const newCode = () => Math.random().toString(36).slice(2, 10).toUpperCase();

export default function AdminDineIn() {
  const { toast } = useToast();
  const [tables, setTables] = useState<TableRow[]>([]);
  const [orders, setOrders] = useState<DineOrder[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [qrs, setQrs] = useState<Record<string, string>>({});
  const [bulk, setBulk] = useState("10");
  const [filter, setFilter] = useState("active");
  const [preview, setPreview] = useState<TableRow | null>(null);
  const [placeFor, setPlaceFor] = useState<TableRow | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [custName, setCustName] = useState("");

  const load = useCallback(async () => {
    const [t, o, f, d] = await Promise.all([
      supabase.from("pos_tables").select("id,table_no,name,seats,code,active").order("table_no"),
      supabase.from("dine_in_orders").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("foods").select("id,title,price").eq("active", true).order("title"),
      supabase.from("deals").select("id,title,price").eq("active", true).order("title"),
    ]);
    setTables((t.data as TableRow[]) || []);
    setOrders((o.data as unknown as DineOrder[]) || []);
    setMenu([...((d.data as MenuItem[]) || []), ...((f.data as MenuItem[]) || [])]);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const ch = supabase
      .channel(`dine-in-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "dine_in_orders" }, (p) => {
        if (p.eventType === "INSERT") {
          toast({ title: `New order from table ${(p.new as DineOrder).table_no}` });
          try { new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=").play(); } catch { /* ignore */ }
        }
        load();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load, toast]);

  useEffect(() => {
    (async () => {
      const map: Record<string, string> = {};
      for (const t of tables) if (t.code) map[t.id] = await QRCode.toDataURL(tableUrl(t.code), { width: 400, margin: 2 });
      setQrs(map);
    })();
  }, [tables]);

  const addTables = async () => {
    const n = Math.min(100, Math.max(1, Number(bulk) || 0));
    const start = (tables.at(-1)?.table_no || 0) + 1;
    const rows = Array.from({ length: n }, (_, i) => ({ table_no: start + i, name: `Table ${start + i}`, seats: 4, area: "Main hall", code: newCode() }));
    const { error } = await supabase.from("pos_tables").insert(rows);
    if (error) return toast({ title: "Could not add tables", description: error.message, variant: "destructive" });
    toast({ title: `${n} tables added with QR codes` });
    load();
  };

  const regen = async (t: TableRow) => {
    if (!confirm(`Make a new QR for ${t.name}? The old QR will stop working.`)) return;
    await supabase.from("pos_tables").update({ code: newCode() }).eq("id", t.id);
    load();
  };

  const remove = async (t: TableRow) => {
    if (!confirm(`Delete ${t.name}?`)) return;
    const { error } = await supabase.from("pos_tables").delete().eq("id", t.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    load();
  };

  const download = (t: TableRow) => {
    const a = document.createElement("a");
    a.href = qrs[t.id]; a.download = `${t.name.replace(/\s+/g, "-")}-qr.png`; a.click();
  };

  const printAll = (list: TableRow[]) => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Table QR codes</title><style>body{font-family:sans-serif;display:flex;flex-wrap:wrap;gap:16px;padding:16px}.c{width:220px;border:2px dashed #999;border-radius:12px;padding:12px;text-align:center;page-break-inside:avoid}img{width:190px}h2{margin:4px 0}p{margin:2px;font-size:12px}</style></head><body>${list.map((t) => `<div class="c"><h2>${t.name}</h2><img src="${qrs[t.id]}"/><p>Scan to order</p><p>Code: ${t.code}</p><p>The Young Malang</p></div>`).join("")}<script>setTimeout(()=>print(),400)</script></body></html>`);
    w.document.close();
  };

  const setStatus = async (o: DineOrder, status: string) => {
    const { error } = await supabase.from("dine_in_orders").update({ status }).eq("id", o.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
  };

  const placeOrder = async () => {
    if (!placeFor) return;
    const items = Object.entries(cart).filter(([, q]) => q > 0).map(([id, quantity]) => {
      const m = menu.find((x) => x.id === id)!;
      return { id, title: m.title, price: Number(m.price), quantity };
    });
    if (!items.length) return toast({ title: "Add at least one item", variant: "destructive" });
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const { error } = await supabase.from("dine_in_orders").insert({
      table_id: placeFor.id, table_no: placeFor.table_no, table_name: placeFor.name,
      customer_name: custName.trim() || "Walk in guest", items, total, placed_by: "staff", status: "accepted",
    });
    if (error) return toast({ title: "Order failed", description: error.message, variant: "destructive" });
    toast({ title: `Order placed for ${placeFor.name}` });
    setPlaceFor(null); setCart({}); setCustName("");
  };

  const shown = useMemo(() => orders.filter((o) =>
    filter === "all" ? true : filter === "active" ? !["completed", "cancelled"].includes(o.status) : o.status === filter), [orders, filter]);
  const activeByTable = useMemo(() => {
    const m: Record<number, number> = {};
    orders.forEach((o) => { if (!["completed", "cancelled"].includes(o.status)) m[o.table_no] = (m[o.table_no] || 0) + 1; });
    return m;
  }, [orders]);
  const cartTotal = Object.entries(cart).reduce((s, [id, q]) => s + (Number(menu.find((m) => m.id === id)?.price) || 0) * q, 0);

  return (
    <AdminLayout title="Dine in and table QR">
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Live orders {shown.length ? `(${orders.filter((o) => !["completed", "cancelled"].includes(o.status)).length})` : ""}</TabsTrigger>
          <TabsTrigger value="tables">Tables and QR</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["active", "all", ...STATUSES].map((s) => (
              <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize shrink-0">{s}</Button>
            ))}
          </div>
          {shown.length === 0 && <Card className="p-8 text-center text-muted-foreground">No orders here yet</Card>}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((o) => (
              <Card key={o.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-lg">{o.table_name || `Table ${o.table_no}`}</p>
                    <p className="text-sm">{o.customer_name}{o.customer_phone ? ` · ${o.customer_phone}` : ""}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()} · by {o.placed_by}</p>
                  </div>
                  <Badge className="capitalize">{o.status}</Badge>
                </div>
                <ul className="text-sm space-y-1">
                  {o.items.map((i, k) => <li key={k} className="flex justify-between"><span>{i.quantity} x {i.title}</span><span>Rs {i.price * i.quantity}</span></li>)}
                </ul>
                {o.notes && <p className="text-xs bg-muted p-2 rounded">Note: {o.notes}</p>}
                <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>Rs {Number(o.total)}</span></div>
                <div className="flex gap-2 flex-wrap">
                  {NEXT[o.status] && <Button size="sm" onClick={() => setStatus(o, NEXT[o.status])} className="capitalize">Mark {NEXT[o.status]}</Button>}
                  {!["completed", "cancelled"].includes(o.status) && <Button size="sm" variant="outline" onClick={() => setStatus(o, "cancelled")}>Cancel</Button>}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <Card className="p-4 flex flex-wrap items-end gap-3">
            <div><Label>How many tables to add</Label><Input type="number" min={1} max={100} value={bulk} onChange={(e) => setBulk(e.target.value)} className="w-32" /></div>
            <Button onClick={addTables}><Plus className="w-4 h-4 mr-1" />Add tables</Button>
            <Button variant="outline" onClick={() => printAll(tables)} disabled={!tables.length}><Printer className="w-4 h-4 mr-1" />Print all QR</Button>
            <p className="text-sm text-muted-foreground">{tables.length} tables · each has its own QR, same menu</p>
          </Card>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {tables.map((t) => (
              <Card key={t.id} className="p-3 space-y-2 text-center">
                <div className="flex justify-between items-center"><p className="font-bold">{t.name}</p>{activeByTable[t.table_no] ? <Badge variant="destructive">{activeByTable[t.table_no]} live</Badge> : <Badge variant="secondary">Free</Badge>}</div>
                {qrs[t.id] ? <img src={qrs[t.id]} alt={`QR for ${t.name}`} className="w-full rounded cursor-pointer" onClick={() => setPreview(t)} /> : <QrCode className="w-full h-24 opacity-30" />}
                <p className="text-xs font-mono">{t.code}</p>
                <div className="flex justify-center gap-1 flex-wrap">
                  <Button size="icon" variant="outline" title="Download" onClick={() => download(t)}><Download className="w-4 h-4" /></Button>
                  <Button size="icon" variant="outline" title="Open menu" onClick={() => t.code && window.open(tableUrl(t.code), "_blank")}><ExternalLink className="w-4 h-4" /></Button>
                  <Button size="icon" variant="outline" title="New QR" onClick={() => regen(t)}><RefreshCw className="w-4 h-4" /></Button>
                  <Button size="icon" variant="outline" title="Delete" onClick={() => remove(t)}><Trash2 className="w-4 h-4" /></Button>
                </div>
                <Button size="sm" className="w-full" onClick={() => setPlaceFor(t)}>Place order</Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{preview?.name}</DialogTitle></DialogHeader>
          {preview && <div className="text-center space-y-2"><img src={qrs[preview.id]} alt="QR" className="mx-auto w-72" /><p className="text-xs break-all">{preview.code && tableUrl(preview.code)}</p><Button onClick={() => printAll([preview])}><Printer className="w-4 h-4 mr-1" />Print</Button></div>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!placeFor} onOpenChange={(o) => !o && setPlaceFor(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New order for {placeFor?.name}</DialogTitle></DialogHeader>
          <Input placeholder="Customer name" value={custName} onChange={(e) => setCustName(e.target.value)} />
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {menu.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-2 text-sm border-b py-1">
                <span className="flex-1">{m.title} <span className="text-muted-foreground">Rs {Number(m.price)}</span></span>
                <Button size="sm" variant="outline" onClick={() => setCart((c) => ({ ...c, [m.id]: Math.max(0, (c[m.id] || 0) - 1) }))}>-</Button>
                <span className="w-6 text-center">{cart[m.id] || 0}</span>
                <Button size="sm" variant="outline" onClick={() => setCart((c) => ({ ...c, [m.id]: (c[m.id] || 0) + 1 }))}>+</Button>
              </div>
            ))}
          </div>
          <Button onClick={placeOrder}>Place order · Rs {cartTotal}</Button>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
