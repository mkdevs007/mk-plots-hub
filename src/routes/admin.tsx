import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { BrandLogo } from "@/components/site/BrandLogo";
import { LayoutDashboard, Globe, LogOut, Loader2, Menu, X, Settings, Inbox, Building, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (location.pathname === "/admin/login") {
        setCheckingAuth(false);
        return;
      }

      if (isSupabaseConfigured) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setAuthenticated(true);
          setUserEmail(session.user.email ?? "admin@mkbuilders.com");
        } else {
          setAuthenticated(false);
          navigate({ to: "/admin/login" });
        }
      } else {
        // Offline test mode check
        const isMockAuth = localStorage.getItem("mock_admin_authenticated") === "true";
        if (isMockAuth) {
          setAuthenticated(true);
          setUserEmail("developer@mkbuilders.com (Offline Mode)");
        } else {
          setAuthenticated(false);
          navigate({ to: "/admin/login" });
        }
      }
      setCheckingAuth(false);
    };

    checkAuth();

    // Subscribe to auth state changes if configured
    let subscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setAuthenticated(true);
          setUserEmail(session.user.email ?? "admin@mkbuilders.com");
        } else if (location.pathname !== "/admin/login") {
          setAuthenticated(false);
          navigate({ to: "/admin/login" });
        }
      });
      subscription = data.subscription;
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
      toast.success("Successfully logged out.");
    } else {
      localStorage.removeItem("mock_admin_authenticated");
      toast.success("Logged out from Local Test Mode.");
    }
    navigate({ to: "/admin/login" });
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  // If not authenticated and we are on an admin page (other than login), don't render layout yet
  if (!authenticated && location.pathname !== "/admin/login") {
    return null;
  }

  // If we are on the login page itself, don't show the layout frame
  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  const sidebarLinks = [
    {
      to: "/admin",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: "/admin/projects",
      label: "Project Management",
      icon: Building,
      exact: true,
    },
    {
      to: "/admin/enquiries",
      label: "User Enquiries",
      icon: Inbox,
      exact: true,
    },
    {
      to: "/admin/blogs",
      label: "Blog CMS",
      icon: FileText,
      exact: true,
    },
    {
      to: "/",
      label: "View Website",
      icon: Globe,
      external: true,
    },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-card border-r border-border/80 relative z-25">
        <div className="p-6 border-b border-border/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo className="h-9 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isLinkActive =
              link.external
                ? false
                : link.exact
                  ? location.pathname === link.to
                  : location.pathname.startsWith(link.to);

            return link.external ? (
              <a
                key={link.label}
                href={link.to}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition"
              >
                <Icon className="w-5 h-5 text-gold" />
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  isLinkActive
                    ? "bg-gold text-gold-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <Icon className={`w-5 h-5 ${isLinkActive ? "text-current" : "text-gold"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-border/80 bg-secondary/20">
          <div className="px-3 py-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
              Signed in as
            </p>
            <p className="text-xs font-bold truncate mt-0.5" title={userEmail || ""}>
              {userEmail}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full mt-2 justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer font-semibold"
          >
            <LogOut className="w-5 h-5 text-destructive" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-card border-b border-border/80 sticky top-0 z-20">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo className="h-8 w-auto" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-secondary/50 text-foreground transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 pt-16 bg-background animate-fade-up">
            <div className="p-4 space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isLinkActive =
                  link.external
                    ? false
                    : link.exact
                      ? location.pathname === link.to
                      : location.pathname.startsWith(link.to);

                return link.external ? (
                  <a
                    key={link.label}
                    href={link.to}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition"
                  >
                    <Icon className="w-5 h-5 text-gold" />
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition ${
                      isLinkActive
                        ? "bg-gold text-gold-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isLinkActive ? "text-current" : "text-gold"}`} />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-6 border-t border-border mt-4">
                <div className="px-4 py-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold truncate mt-0.5">{userEmail}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full mt-4 justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer font-semibold"
                >
                  <LogOut className="w-5 h-5 text-destructive" />
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
