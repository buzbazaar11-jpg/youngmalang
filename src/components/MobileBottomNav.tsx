import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, ShoppingCart, ClipboardList, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const HIDDEN_PREFIXES = ["/admin", "/pos", "/rider", "/table"];

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Menu", href: "/menu", icon: UtensilsCrossed },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Orders", href: "/orders", icon: ClipboardList },
  { label: "Profile", href: "/profile", icon: User },
];

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { totalItems } = useCart();
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <>
      <div className="h-16 md:hidden" aria-hidden />
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-lg"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-5 h-16">
          {items.map(({ label, href, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  to={href}
                  className={cn(
                    "relative flex flex-col items-center justify-center h-full gap-0.5 text-[11px] font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span className="relative">
                    <Icon className="w-5 h-5" />
                    {href === "/cart" && totalItems > 0 && (
                      <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </span>
                  {label}
                  {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default MobileBottomNav;
