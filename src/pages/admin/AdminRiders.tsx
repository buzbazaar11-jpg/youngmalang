import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Bike, Plus, Trash2, Package, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RiderProfile {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

interface RiderStats {
  total: number;
  delivered: number;
}

const AdminRiders = () => {
  const [riders, setRiders] = useState<RiderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addName, setAddName] = useState("");
  const [adding, setAdding] = useState(false);
  const [riderStats, setRiderStats] = useState<Record<string, RiderStats>>({});
  const { toast } = useToast();

  const fetchRiders = async () => {
    const { data: roles } = await supabase.from("user_roles" as any).select("user_id").eq("role", "rider");
    if (!roles || roles.length === 0) {
      setRiders([]);
      setLoading(false);
      return;
    }

    const riderIds = (roles as any[]).map((r: any) => r.user_id);
    const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", riderIds);
    setRiders((profiles || []) as RiderProfile[]);

    // Fetch stats for each rider
    const { data: orders } = await supabase.from("orders").select("rider_id, status").in("rider_id", riderIds);
    const stats: Record<string, RiderStats> = {};
    riderIds.forEach(id => {
      const riderOrders = (orders || []).filter((o: any) => o.rider_id === id);
      stats[id] = {
        total: riderOrders.length,
        delivered: riderOrders.filter((o: any) => o.status === "delivered").length,
      };
    });
    setRiderStats(stats);
    setLoading(false);
  };

  useEffect(() => { fetchRiders(); }, []);

  const addRider = async () => {
    if (!addEmail.trim() || !addPassword.trim()) {
      toast({ title: "Email and password required", variant: "destructive" });
      return;
    }
    if (addPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setAdding(true);

    const { data, error } = await supabase.functions.invoke("admin-create-rider", {
      body: {
        email: addEmail.trim(),
        password: addPassword,
        full_name: addName.trim(),
      },
    });

    if (error || (data as any)?.error) {
      const msg = (data as any)?.error || error?.message || "Failed to create rider";
      toast({ title: "Failed to create rider", description: msg, variant: "destructive" });
      setAdding(false);
      return;
    }

    toast({ title: "Rider created & approved! 🏍️", description: "They can now log in at /rider/login" });
    setAddDialogOpen(false);
    setAddEmail("");
    setAddPassword("");
    setAddName("");
    fetchRiders();
    setAdding(false);
  };

  const removeRider = async (userId: string) => {
    if (!confirm("Remove rider role from this user?")) return;
    const { error } = await supabase.from("user_roles" as any).delete().eq("user_id", userId).eq("role", "rider");
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rider role removed" });
      fetchRiders();
    }
  };

  const filtered = riders.filter(r =>
    (r.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.phone || "").includes(search)
  );

  return (
    <AdminLayout title="Riders Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search riders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Rider
          </Button>
        </div>

        {loading ? (
          <p className="text-center py-12 text-muted-foreground">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Bike className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No riders yet. Add your first rider!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((rider) => (
              <motion.div key={rider.user_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bike className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{rider.full_name || "Unnamed"}</p>
                          <p className="text-xs text-muted-foreground">{rider.phone || "No phone"}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeRider(rider.user_id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{riderStats[rider.user_id]?.total || 0} orders</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        ✅ {riderStats[rider.user_id]?.delivered || 0} delivered
                      </div>
                    </div>
                    <Button asChild size="sm" className="w-full gap-2"><Link to={`/admin/riders/${rider.user_id}`}><Eye className="w-4 h-4" /> Manage</Link></Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add rider dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Add New Rider</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Full Name</Label>
                <Input value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="Rider name" />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} placeholder="rider@email.com" required />
              </div>
              <div>
                <Label>Password *</Label>
                <Input type="password" value={addPassword} onChange={(e) => setAddPassword(e.target.value)} placeholder="Min 6 characters" required />
              </div>
              <Button className="w-full" onClick={addRider} disabled={adding}>
                {adding ? "Creating..." : "Create Rider Account"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminRiders;
