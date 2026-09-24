import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Palmtree, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

interface NavigationProps {
  variant?: "default" | "dark";
}

const Navigation = ({
  variant = "default"
}: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDark = variant === "dark";
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Descobrir", href: "/descobrir", isRoute: true },
    { label: "Sobre", href: "/sobre", isRoute: true },
    { label: "Contato", href: "/contato", isRoute: true },
  ];

  const textColor = isMobileMenuOpen || isDark ? "text-white" : "text-foreground";

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
      className={`fixed top-0 left-0 right-0 z-[1100] transition-all duration-400 ${
        isMobileMenuOpen
          ? "bg-foreground"
          : isDark
          ? isScrolled
            ? "bg-foreground/95 backdrop-blur-lg shadow-soft"
            : "bg-foreground"
          : isScrolled
          ? "bg-card/95 backdrop-blur-lg shadow-soft"
          : "bg-background/80 backdrop-blur-md shadow-soft"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 py-5">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Palmtree className={`h-4 w-4 ${textColor}`} />
              <span className={`text-sm font-normal tracking-wide ${textColor}`}>
                Descubra Paraíba
              </span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-[11px] uppercase tracking-wider font-normal smooth-hover hover:opacity-60 ${textColor}`}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-[11px] uppercase tracking-wider font-normal smooth-hover hover:opacity-60 ${textColor}`}
                >
                  {item.label}
                </a>
              )
            )}
            {user && isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin")}
                className={`rounded-full smooth-hover text-[11px] uppercase tracking-wider font-normal backdrop-blur-md border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] px-5 ${
                  isDark || !isScrolled
                    ? "bg-white/10 text-white hover:bg-primary/80 hover:text-white hover:border-primary/80"
                    : "bg-white/20 text-foreground hover:bg-primary/80 hover:text-white hover:border-primary/80"
                }`}
              >
                Painel Admin
              </Button>
            )}
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className={`rounded-full smooth-hover text-[11px] uppercase tracking-wider font-normal backdrop-blur-md border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] px-5 ${
                  isDark || !isScrolled
                    ? "bg-white/10 text-white hover:bg-primary/80 hover:text-white hover:border-primary/80"
                    : "bg-white/20 text-foreground hover:bg-primary/80 hover:text-white hover:border-primary/80"
                }`}
              >
                <LogOut className="mr-2 h-3 w-3" />
                Sair
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/descobrir")}
                className={`rounded-full smooth-hover text-[11px] uppercase tracking-wider font-normal backdrop-blur-md border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] px-5 ${
                  isDark || !isScrolled
                    ? "bg-white/10 text-white hover:bg-primary/80 hover:text-white hover:border-primary/80"
                    : "bg-white/20 text-foreground hover:bg-primary/80 hover:text-white hover:border-primary/80"
                }`}
              >
                Explorar
              </Button>
            )}
          </div>

          <button
            className={`md:hidden ${textColor}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className={`md:hidden mt-6 pb-4 -mx-6 px-6 rounded-b-xl ${
                isDark || !isScrolled ? "bg-foreground" : "bg-card"
              }`}
            >
              {navItems.map((item) =>
                item.isRoute ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`block py-3 text-[11px] uppercase tracking-wider font-normal smooth-hover hover:opacity-60 ${textColor}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`block py-3 text-[11px] uppercase tracking-wider font-normal smooth-hover hover:opacity-60 ${textColor}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              )}
              {user && isAdmin && (
                <Button
                  variant="outline"
                  className={`w-full mt-4 rounded-full text-[11px] uppercase tracking-wider font-normal backdrop-blur-md border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] px-5 ${
                    isDark || !isScrolled
                      ? "bg-white/10 text-white hover:bg-primary/80 hover:text-white hover:border-primary/80"
                      : "bg-white/20 text-foreground hover:bg-primary/80 hover:text-white hover:border-primary/80"
                  }`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/admin");
                  }}
                >
                  Painel Admin
                </Button>
              )}
              {user ? (
                <Button
                  variant="outline"
                  className={`w-full mt-4 rounded-full text-[11px] uppercase tracking-wider font-normal backdrop-blur-md border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] px-5 ${
                    isDark || !isScrolled
                      ? "bg-white/10 text-white hover:bg-primary/80 hover:text-white hover:border-primary/80"
                      : "bg-white/20 text-foreground hover:bg-primary/80 hover:text-white hover:border-primary/80"
                  }`}
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-3 w-3" />
                  Sair
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className={`w-full mt-4 rounded-full text-[11px] uppercase tracking-wider font-normal backdrop-blur-md border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] px-5 ${
                    isDark || !isScrolled
                      ? "bg-white/10 text-white hover:bg-primary/80 hover:text-white hover:border-primary/80"
                      : "bg-white/20 text-foreground hover:bg-primary/80 hover:text-white hover:border-primary/80"
                  }`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/descobrir");
                  }}
                >
                  Explorar
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
