import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ShieldAlert, KeyRound, Mail, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      if (isSupabaseConfigured) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          navigate({ to: "/admin" });
        }
      }
      setCheckingAuth(false);
    };

    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSupabaseConfigured) {
      toast.error("Supabase credentials not configured in environment.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Successfully logged in.");
      navigate({ to: "/admin" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineMode = () => {
    // Save a flag in localStorage to mock auth offline
    localStorage.setItem("mock_admin_authenticated", "true");
    toast.success("Logged in via Local Test Mode.");
    navigate({ to: "/admin" });
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative overflow-hidden bg-background">
      {/* Decorative ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-card/65 backdrop-blur-xl border border-border/80 rounded-2xl p-8 shadow-card-hover relative z-10 animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl gold-gradient items-center justify-center text-gold-foreground mb-4 shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Console</h1>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-semibold">
            MK Builders & Developers
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex gap-3 text-amber-500 items-start text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Local Offline Mode Active</p>
              <p className="text-xs text-amber-500/80 mt-1">
                Supabase variables are empty. You can log in using "Local Test Mode" to try the admin features.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="admin@mkbuilders.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 bg-background border-border text-foreground focus-visible:ring-gold"
                required
                disabled={!isSupabaseConfigured || loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11 bg-background border-border text-foreground focus-visible:ring-gold"
                required
                disabled={!isSupabaseConfigured || loading}
              />
            </div>
          </div>

          {isSupabaseConfigured ? (
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 gold-gradient text-gold-foreground font-semibold rounded-lg shadow hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Access Console <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleOfflineMode}
              className="w-full h-11 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-lg border border-white/10 shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Log in with Local Test Mode <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
