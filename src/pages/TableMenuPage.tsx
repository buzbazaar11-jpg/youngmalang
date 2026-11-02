import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { Minus, Plus, ShoppingBag, CheckCircle2, Clock, ChefHat, Bell, UtensilsCrossed } from "lucide-react";

interface Item { id: string; title: string; price: number; image_url: string; description: string | null; category: string }
interface Track { id: string; table_no: number; table_name: string; customer_name: string; items: { title: string; quantity: number; price: number }[]; total: number; status: string; created_at: string }

const STEPS = [
  { key: "pending", label: "Received", icon: Clock },
  { key: "accepted", label: "Accepted", icon: CheckCircle2 },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "ready", label: "Ready", icon: Bell },
  { key: "served", label: "Served", icon: UtensilsCrossed },
];

export default function TableMenuPage() {
  const { code = "" } = useParams();
  const { toast } = useToast();
  const storeKey = `dinein-orders-${code}`;
  const [table, setTable] = useState<{ id: string; table_no: number; name: string } | null | undefined>(undefined);
  const [items, setItems] = useState<Item[]>([]);
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [orderIds, setOrderIds] = useState<string[]>(() => JSON.parse(localStorage.getItem(storeKey) || "[]"));
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("get_table_by_code", { _code: code });
      setTable(data?.[0] ?? null);
      const [f, d] = await Promise.all([
        supabase.from("foods").select("id,title,price,image_url,description,categories(title)").eq("active", true),
        supabase.from("deals").select("id,title,price,image_url,description").eq("active", true),
      ]);
      setItems([
        ...((d.data || []).map((x) => ({ ...x, category: "Deals" })) as Item[]),
        ...((f.data || []).map((x: any) => ({ ...x, category: x.categories?.title || "Menu" })) as Item[]),
      ]);
    })();
  }, [code]);

  useEffect(() => {
    if (!orderIds.length) return;
    const fetchAll = async () => {
      const res = await Promise.all(orderIds.map((id) => supabase.rpc("get_dine_in_order", { _id: id })));
      setTracks(res.map((r) => r.data?.[0]).filter(Boolean) as unknown as Track[]);
    };
    fetchAll();
    const t = setInterval(fetchAll, 8000);
    return () => clearInterval(t);
  }, [orderIds]);

  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const shown = cat === "All" ? items : items.filter((i) => i.category === cat);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((s, [id, q]) => s + (Number(items.find((i) => i.id === id)?.price) || 0) * q, 0);
  const change = (id: string, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) + d) }));

  const place = async () => {
    if (!name.trim()) return toast({ title: "Please enter your name", variant: "destructive" });
    setPlacing(true);
    const payload = Object.entries(cart).filter(([, q]) => q > 0).map(([id, quantity]) => ({ id, quantity }));
    const { data, error } = await supabase.rpc("place_dine_in_order", { _code: code, _name: name, _phone: phone, _notes: notes, _items: payload });
    setPlacing(false);
    if (error) return toast({ title: "Order failed", description: error.message, variant: "destructive" });
    const ids = [data as string, ...orderIds];
    localStorage.setItem(storeKey, JSON.stringify(ids));
    setOrderIds(ids); setCart({}); setNotes(""); setCheckout(false);
    toast({ title: "Order placed", description: "You can track it below" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (table === undefined) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading menu</div>;
  if (table === null) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
      <img src={logo} alt="The Young Malang" className="w-24" />
      <h1 className="text-2xl font-bold">This QR code is not valid</h1>
      <p className="text-muted-foreground">Please ask our staff for help</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b px-4 py-3 flex items-center gap-3">
        <img src={logo} alt="The Young Malang" className="w-11 h-11" />
        <div className="flex-1"><p className="font-bold leading-tight">The Young Malang</p><p className="text-xs text-muted-foreground">Dine in menu</p></div>
        <Badge className="text-sm">{table.name}</Badge>
      </header>

      {tracks.length > 0 && (
        <section className="p-4 space-y-3">
          <h2 className="font-bold text-lg">Your orders</h2>
          {tracks.map((t) => {
            const idx = STEPS.findIndex((s) => s.key === t.status);
            return (
              <Card key={t.id} className="p-4 space-y-3">
                <div className="flex justify-between text-sm"><span>{t.items.map((i) => `${i.quantity} x ${i.title}`).join(", ")}</span><span className="font-semibold shrink-0 ml-2">Rs {Number(t.total)}</span></div>
                {t.status === "cancelled" ? <Badge variant="destructive">Cancelled</Badge> : t.status === "completed" ? <Badge>Completed, thank you</Badge> : (
                  <div className="flex justify-between">
                    {STEPS.map((s, i) => (
                      <div key={s.key} className={`flex flex-col items-center gap-1 text-[11px] ${i <= idx ? "text-primary" : "text-muted-foreground"}`}>
                        <s.icon className="w-5 h-5" />{s.label}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </section>
      )}

      <div className="sticky top-[68px] z-10 bg-background px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {cats.map((c) => <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} className="shrink-0 rounded-full" onClick={() => setCat(c)}>{c}</Button>)}
      </div>

      <main className="px-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((i) => (
          <Card key={i.id} className="p-3 flex gap-3">
            <img src={i.image_url} alt={i.title} className="w-24 h-24 rounded-lg object-cover shrink-0" loading="lazy" />
            <div className="flex-1 flex flex-col">
              <p className="font-semibold">{i.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{i.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold text-primary">Rs {Number(i.price)}</span>
                {cart[i.id] ? (
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => change(i.id, -1)}><Minus className="w-4 h-4" /></Button>
                    <span>{cart[i.id]}</span>
                    <Button size="icon" className="h-8 w-8" onClick={() => change(i.id, 1)}><Plus className="w-4 h-4" /></Button>
                  </div>
                ) : <Button size="sm" onClick={() => change(i.id, 1)}>Add</Button>}
              </div>
            </div>
          </Card>
        ))}
      </main>

      {count > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-card border-t p-4 space-y-3 shadow-lg">
          {checkout && (
            <div className="space-y-2 max-w-xl mx-auto">
              <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Textarea placeholder="Any note for the kitchen" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
          )}
          <Button className="w-full max-w-xl mx-auto flex" size="lg" disabled={placing} onClick={() => (checkout ? place() : setCheckout(true))}>
            <ShoppingBag className="w-5 h-5 mr-2" />
            {checkout ? (placing ? "Placing order" : `Place order · Rs ${total}`) : `View order · ${count} items · Rs ${total}`}
          </Button>
        </div>
      )}
    </div>
  );
}
