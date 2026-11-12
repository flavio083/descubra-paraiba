import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Palmtree, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

interface NavigationProps {
  variant?: "default" | "dark";
}

const navItems = [
  { label: "Descobrir", href: "/descobrir" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-sm px-3 py-2 text-xs uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sand focus-visible:ring-offset-2 focus-visible:ring-offset-brand-forest ${
    isActive
      ? "bg-white/15 text-white"
      : "text-white/85 hover:bg-white/10 hover:text-white"
  }`;

const exploreButtonClassName =
  "min-h-10 rounded-md border border-white bg-white px-5 text-xs font-medium text-primary transition-colors hover:border-brand-sand hover:bg-brand-sand hover:text-primary active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sand focus-visible:ring-offset-2 focus-visible:ring-offset-brand-forest";

const secondaryButtonClassName =
  "min-h-10 rounded-md border border-white/40 bg-transparent px-4 text-xs font-medium text-white transition-colors hover:border-white hover:bg-white/10 hover:text-white active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sand focus-visible:ring-offset-2 focus-visible:ring-offset-brand-forest";

const Navigation = ({ variant = "default" }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      data-variant={variant}
      aria-label="Navegação principal"
      className={`fixed left-0 right-0 top-0 z-[1100] border-b border-white/10 bg-brand-forest text-white transition-shadow duration-300 ${
        isScrolled ? "shadow-soft" : "shadow-none"
      }`}
    >
      <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-12">
        <div className="flex min-h-11 items-center justify-between gap-4">
          <Link
            to="/"
            aria-label="Descubra Paraíba — página inicial"
            className="group inline-flex min-h-11 items-center gap-2 rounded-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sand focus-visible:ring-offset-2 focus-visible:ring-offset-brand-forest"
          >
            <Palmtree aria-hidden="true" className="h-5 w-5 shrink-0 text-brand-sand" />
            <span className="font-editorial text-base font-medium tracking-tight sm:text-lg">
              Descubra Paraíba
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={navLinkClassName}
              >
                {item.label}
              </NavLink>
            ))}

            {user && isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin")}
                className={secondaryButtonClassName}
              >
                Painel Admin
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => navigate("/descobrir")}
              className={exploreButtonClassName}
            >
              Explorar
            </Button>

            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className={secondaryButtonClassName}
              >
                <LogOut aria-hidden="true" className="mr-1 h-3.5 w-3.5" />
                Sair
              </Button>
            )}
          </div>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sand focus-visible:ring-offset-2 focus-visible:ring-offset-brand-forest md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-navigation-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-1 border-t border-white/15 pb-4 pt-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    className={navLinkClassName}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}

                {user && isAdmin && (
                  <Button
                    variant="outline"
                    className={`mt-2 w-full ${secondaryButtonClassName}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/admin");
                    }}
                  >
                    Painel Admin
                  </Button>
                )}

                <Button
                  className={`mt-2 w-full ${exploreButtonClassName}`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/descobrir");
                  }}
                >
                  Explorar
                </Button>

                {user && (
                  <Button
                    variant="outline"
                    className={`mt-2 w-full ${secondaryButtonClassName}`}
                    onClick={handleSignOut}
                  >
                    <LogOut aria-hidden="true" className="mr-1 h-3.5 w-3.5" />
                    Sair
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
