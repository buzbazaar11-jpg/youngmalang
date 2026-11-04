import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bike, Check, ExternalLink, Package, Route, Send, Trash2, Wallet, X } from "lucide-react";

const db = supabase as any;
const money = (n: number) => `Rs ${Math.round(Number(n) || 0).toLocaleString()}`;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const fmt = (d?: string | null) => (d ? new Date(d).toLocaleString() : "-");

const AdminRiderManage = () => {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const err = (e: any) => e && toast({ title: "Failed", description: e.message, variant: "destructive" });

  const load = async () => {
    const [p, o, d, py, s, n, m, st] = await Promise.all([
      db.from("profiles").select("*").eq("user_id", id).maybeSingle(),
      db.from("orders").select("*").eq("rider_id", id).order("created_at", { ascending: false }),
      db.from("rider_documents").select("*").eq("rider_id", id).order("created_at", { ascending: false }),
      db.from("rider_payouts").select("*").eq("rider_id", id).order("created_at", { ascending: false }),
      db.from("rider_schedule").select("*").eq("rider_id", id).order("day_of_week"),
      db.from("rider_notifications").select("*").eq("rider_id", id).order("created_at", { ascending: false }),
      db.from("rider_messages").select("*").eq("rider_id", id).order("created_at"),
      db.from("rider_settings").select("*").limit(1).maybeSingle(),
    ]);
    setProfile(p.data);
    setOrders(o.data || []);
    setDocs(d.data || []);
    setPayouts(py.data || []);
    setSchedule(s.data || []);
    setNotifs(n.data || []);
    setMsgs(m.data || []);
    setSettings(st.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const stats = useMemo(() => {
    const delivered = orders.filter((o) => o.status === "delivered");
    const km = delivered.reduce((a, o) => a + Number(o.distance_km || 0), 0);
    const today = new Date().toDateString();
    const todayKm = delivered.filter((o) => new Date(o.delivered_at || o.created_at).toDateString() === today)
      .reduce((a, o) => a + Number(o.distance_km || 0), 0);
    const commission = Number(settings?.commission_percent || 0);
    const perKm = Number(settings?.per_km_rate || 0);
    const earned = delivered.reduce((a, o) => a + (Number(o.total) * commission) / 100, 0) + km * perKm;
    const paid = payouts.filter((p) => p.status === "paid").reduce((a, p) => a + Number(p.amount), 0);
    const points = delivered.length * Number(settings?.points_per_order || 0);
    return { total: orders.length, delivered: delivered.length, active: orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length, km, todayKm, earned, paid, balance: earned - paid, points };
  }, [orders, payouts, settings]);

  // Profile
  const saveProfile = async () => {
    const { error } = await db.from("profiles").update({ full_name: profile.full_name, phone: profile.phone, address: profile.address }).eq("user_id", id);
    err(error); if (!error) toast({ title: "Profile saved" });
  };
  const removeRider = async () => {
    if (!confirm("Remove rider access for this person?")) return;
    const { error } = await db.from("user_roles").delete().eq("user_id", id).eq("role", "rider");
    err(error); if (!error) { toast({ title: "Rider removed" }); nav("/admin/riders"); }
  };

  // Orders
  const updateOrder = async (oid: string, patch: any) => {
    const { error } = await db.from("orders").update(patch).eq("id", oid); err(error); load();
  };

  // Documents
  const [doc, setDoc] = useState({ doc_type: "", file_url: "", expiry_date: "" });
  const addDoc = async () => {
    if (!doc.doc_type) return toast({ title: "Document type required", variant: "destructive" });
    const { error } = await db.from("rider_documents").insert({ rider_id: id, ...doc, expiry_date: doc.expiry_date || null, status: "approved" });
    err(error); if (!error) { setDoc({ doc_type: "", file_url: "", expiry_date: "" }); load(); }
  };
  const docStatus = async (did: string, status: string) => { const { error } = await db.from("rider_documents").update({ status }).eq("id", did); err(error); load(); };
  const delDoc = async (did: string) => { if (!confirm("Delete document?")) return; const { error } = await db.from("rider_documents").delete().eq("id", did); err(error); load(); };

  // Payouts
  const [pay, setPay] = useState({ amount: "", notes: "", period_start: "", period_end: "" });
  const addPayout = async () => {
    if (!Number(pay.amount)) return toast({ title: "Enter amount", variant: "destructive" });
    const { error } = await db.from("rider_payouts").insert({ rider_id: id, amount: Number(pay.amount), notes: pay.notes || null, period_start: pay.period_start || null, period_end: pay.period_end || null, status: "pending" });
    err(error); if (!error) { setPay({ amount: "", notes: "", period_start: "", period_end: "" }); load(); }
  };
  const payStatus = async (pid: string, status: string) => {
    const { error } = await db.from("rider_payouts").update({ status, paid_at: status === "paid" ? new Date().toISOString() : null }).eq("id", pid); err(error); load();
  };
  const delPayout = async (pid: string) => { if (!confirm("Delete payout?")) return; const { error } = await db.from("rider_payouts").delete().eq("id", pid); err(error); load(); };

  // Schedule
  const [sch, setSch] = useState({ day_of_week: "1", start_time: "10:00", end_time: "22:00" });
  const addSlot = async () => {
    const { error } = await db.from("rider_schedule").insert({ rider_id: id, day_of_week: Number(sch.day_of_week), start_time: sch.start_time, end_time: sch.end_time, available: true });
    err(error); load();
  };
  const toggleSlot = async (s: any) => { const { error } = await db.from("rider_schedule").update({ available: !s.available }).eq("id", s.id); err(error); load(); };
  const delSlot = async (sid: string) => { const { error } = await db.from("rider_schedule").delete().eq("id", sid); err(error); load(); };

  // Notifications
  const [nt, setNt] = useState({ title: "", body: "" });
  const sendNotif = async () => {
    if (!nt.title || !nt.body) return toast({ title: "Title and message required", variant: "destructive" });
    const { error } = await db.from("rider_notifications").insert({ rider_id: id, ...nt });
    err(error); if (!error) { setNt({ title: "", body: "" }); toast({ title: "Notification sent" }); load(); }
  };
  const delNotif = async (nid: string) => { const { error } = await db.from("rider_notifications").delete().eq("id", nid); err(error); load(); };

  // Chat
  const [reply, setReply] = useState("");
  const sendMsg = async () => {
    if (!reply.trim()) return;
    const { error } = await db.from("rider_messages").insert({ rider_id: id, sender: "admin", body: reply.trim() });
    err(error); if (!error) { setReply(""); load(); }
  };
  const delMsg = async (mid: string) => { const { error } = await db.from("rider_messages").delete().eq("id", mid); err(error); load(); };

  if (loading) return <AdminLayout title="Manage rider"><p className="text-center py-12 text-muted-foreground">Loading...</p></AdminLayout>;

  const statusBadge = (s: string) => <Badge variant={s === "approved" || s === "paid" || s === "delivered" ? "default" : s === "rejected" || s === "cancelled" ? "destructive" : "secondary"}>{s}</Badge>;

  return (
    <AdminLayout title="Manage rider">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild><Link to="/admin/riders"><ArrowLeft className="w-5 h-5" /></Link></Button>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><Bike className="w-6 h-6 text-primary" /></div>
            <div>
              <h2 className="text-xl font-bold">{profile?.full_name || "Rider"}</h2>
              <p className="text-sm text-muted-foreground">{profile?.phone || "No phone"} · joined {profile ? new Date(profile.created_at).toLocaleDateString() : "-"}</p>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={removeRider}><Trash2 className="w-4 h-4 mr-1" /> Remove rider</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "Total orders", v: stats.total, i: Package },
            { l: "Delivered", v: stats.delivered, i: Check },
            { l: "Total km", v: `${stats.km.toFixed(1)} km`, i: Route },
            { l: "Today km", v: `${stats.todayKm.toFixed(1)} km`, i: Route },
            { l: "Earned", v: money(stats.earned), i: Wallet },
            { l: "Paid out", v: money(stats.paid), i: Wallet },
            { l: "Balance due", v: money(stats.balance), i: Wallet },
            { l: "Reward points", v: stats.points, i: Bike },
          ].map(({ l, v, i: I }) => (
            <Card key={l}><CardContent className="p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><I className="w-4 h-4" />{l}</div><p className="text-lg font-bold mt-1">{v}</p></CardContent></Card>
          ))}
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="docs">Documents ({docs.length})</TabsTrigger>
            <TabsTrigger value="payouts">Payouts ({payouts.length})</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="notifs">Notifications</TabsTrigger>
            <TabsTrigger value="chat">Chat ({msgs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card><CardContent className="p-5 grid sm:grid-cols-2 gap-4">
              <div><Label>Full name</Label><Input value={profile?.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={profile?.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Address</Label><Textarea value={profile?.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></div>
              <div className="sm:col-span-2 text-sm text-muted-foreground">Commission {settings?.commission_percent ?? 0}% · Rs {settings?.per_km_rate ?? 0} per km · {settings?.points_per_order ?? 0} points per order (change in rider settings)</div>
              <Button onClick={saveProfile} className="sm:w-fit">Save profile</Button>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card><CardContent className="p-0 divide-y divide-border">
              {orders.length === 0 && <p className="p-6 text-center text-muted-foreground">No orders assigned yet</p>}
              {orders.map((o) => (
                <div key={o.id} className="p-4 flex flex-wrap gap-3 items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium">#{o.id.slice(0, 8)} · {o.customer_name || "Customer"} · {money(o.total)}</p>
                    <p className="text-xs text-muted-foreground truncate">{o.customer_address || "-"} · {fmt(o.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(o.status)}
                    <Input type="number" step="0.1" className="w-24 h-8" placeholder="km" defaultValue={o.distance_km ?? ""} onBlur={(e) => e.target.value !== String(o.distance_km ?? "") && updateOrder(o.id, { distance_km: e.target.value ? Number(e.target.value) : null })} />
                    <select className="h-8 rounded-md border border-input bg-background px-2 text-sm" value={o.status} onChange={(e) => updateOrder(o.id, { status: e.target.value, ...(e.target.value === "delivered" ? { delivered_at: new Date().toISOString() } : {}) })}>
                      {["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                    <Button size="sm" variant="outline" onClick={() => confirm("Unassign this order from rider?") && updateOrder(o.id, { rider_id: null })}>Unassign</Button>
                  </div>
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <Card><CardHeader><CardTitle className="text-base">Add document</CardTitle></CardHeader><CardContent className="grid sm:grid-cols-4 gap-3">
              <Input placeholder="Type e.g. CNIC, licence" value={doc.doc_type} onChange={(e) => setDoc({ ...doc, doc_type: e.target.value })} />
              <Input placeholder="File link" value={doc.file_url} onChange={(e) => setDoc({ ...doc, file_url: e.target.value })} />
              <Input type="date" value={doc.expiry_date} onChange={(e) => setDoc({ ...doc, expiry_date: e.target.value })} />
              <Button onClick={addDoc}>Add</Button>
            </CardContent></Card>
            <Card><CardContent className="p-0 divide-y divide-border">
              {docs.length === 0 && <p className="p-6 text-center text-muted-foreground">Rider has not uploaded documents</p>}
              {docs.map((d) => (
                <div key={d.id} className="p-4 flex flex-wrap gap-3 items-center justify-between">
                  <div><p className="font-medium">{d.doc_type}</p><p className="text-xs text-muted-foreground">Expiry {d.expiry_date || "-"} · added {fmt(d.created_at)}</p></div>
                  <div className="flex items-center gap-2">
                    {statusBadge(d.status)}
                    {d.file_url && <Button size="sm" variant="outline" asChild><a href={d.file_url} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4" /></a></Button>}
                    <Button size="sm" variant="outline" onClick={() => docStatus(d.id, "approved")}><Check className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => docStatus(d.id, "rejected")}><X className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => delDoc(d.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-4">
            <Card><CardHeader><CardTitle className="text-base">New payout · balance due {money(stats.balance)}</CardTitle></CardHeader><CardContent className="grid sm:grid-cols-5 gap-3">
              <Input type="number" placeholder="Amount" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} />
              <Input type="date" value={pay.period_start} onChange={(e) => setPay({ ...pay, period_start: e.target.value })} />
              <Input type="date" value={pay.period_end} onChange={(e) => setPay({ ...pay, period_end: e.target.value })} />
              <Input placeholder="Note" value={pay.notes} onChange={(e) => setPay({ ...pay, notes: e.target.value })} />
              <Button onClick={addPayout}>Create</Button>
            </CardContent></Card>
            <Card><CardContent className="p-0 divide-y divide-border">
              {payouts.length === 0 && <p className="p-6 text-center text-muted-foreground">No payouts yet</p>}
              {payouts.map((p) => (
                <div key={p.id} className="p-4 flex flex-wrap gap-3 items-center justify-between">
                  <div><p className="font-medium">{money(p.amount)}</p><p className="text-xs text-muted-foreground">{p.period_start || "-"} to {p.period_end || "-"} · {p.notes || "no note"} · paid {fmt(p.paid_at)}</p></div>
                  <div className="flex items-center gap-2">
                    {statusBadge(p.status)}
                    {p.status !== "paid" && <Button size="sm" onClick={() => payStatus(p.id, "paid")}>Mark paid</Button>}
                    {p.status === "pending" && <Button size="sm" variant="outline" onClick={() => payStatus(p.id, "rejected")}>Reject</Button>}
                    <Button size="sm" variant="ghost" onClick={() => delPayout(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card><CardContent className="p-4 grid sm:grid-cols-4 gap-3">
              <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={sch.day_of_week} onChange={(e) => setSch({ ...sch, day_of_week: e.target.value })}>
                {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
              <Input type="time" value={sch.start_time} onChange={(e) => setSch({ ...sch, start_time: e.target.value })} />
              <Input type="time" value={sch.end_time} onChange={(e) => setSch({ ...sch, end_time: e.target.value })} />
              <Button onClick={addSlot}>Add shift</Button>
            </CardContent></Card>
            <Card><CardContent className="p-0 divide-y divide-border">
              {schedule.length === 0 && <p className="p-6 text-center text-muted-foreground">No schedule set</p>}
              {schedule.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between">
                  <p className="font-medium">{DAYS[s.day_of_week]} · {s.start_time} to {s.end_time}</p>
                  <div className="flex items-center gap-3"><Switch checked={s.available} onCheckedChange={() => toggleSlot(s)} /><Button size="sm" variant="ghost" onClick={() => delSlot(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div>
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="notifs" className="space-y-4">
            <Card><CardContent className="p-4 space-y-3">
              <Input placeholder="Title" value={nt.title} onChange={(e) => setNt({ ...nt, title: e.target.value })} />
              <Textarea placeholder="Message" value={nt.body} onChange={(e) => setNt({ ...nt, body: e.target.value })} />
              <Button onClick={sendNotif}><Send className="w-4 h-4 mr-1" /> Send to rider</Button>
            </CardContent></Card>
            <Card><CardContent className="p-0 divide-y divide-border">
              {notifs.map((n) => (
                <div key={n.id} className="p-4 flex items-start justify-between gap-3">
                  <div><p className="font-medium">{n.title} {n.read ? <Badge variant="secondary">read</Badge> : <Badge>new</Badge>}</p><p className="text-sm text-muted-foreground">{n.body}</p><p className="text-xs text-muted-foreground">{fmt(n.created_at)}</p></div>
                  <Button size="sm" variant="ghost" onClick={() => delNotif(n.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card><CardContent className="p-4 space-y-3">
              <div className="max-h-[420px] overflow-y-auto space-y-2">
                {msgs.length === 0 && <p className="text-center text-muted-foreground py-6">No messages yet</p>}
                {msgs.map((m) => (
                  <div key={m.id} className={`group flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {m.body}<div className="text-[10px] opacity-70 mt-1 flex gap-2">{fmt(m.created_at)}<button onClick={() => delMsg(m.id)} className="underline">delete</button></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2"><Input placeholder="Reply to rider" value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg()} /><Button onClick={sendMsg}><Send className="w-4 h-4" /></Button></div>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminRiderManage;
