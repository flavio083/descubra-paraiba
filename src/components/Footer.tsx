import { Palmtree, Instagram, Facebook, Mail, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

const Footer = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <footer className="bg-foreground text-background py-20 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palmtree className="h-4 w-4" />
              <span className="text-sm font-normal tracking-wide">Descubra Paraíba</span>
            </div>
            <p className="text-background/70 text-xs font-light leading-relaxed max-w-xs">
              Descubra praias, trilhas, formações naturais e patrimônios históricos
              da Paraíba em um só lugar.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Páginas</h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              <li>
                <Link to="/" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/descobrir" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Descobrir
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Contato
                </Link>
              </li>
              {user && isAdmin && (
                <li>
                <Link to="/admin" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Painel Admin
                </Link>
                </li>
              )}
              {user && (
                <li>
                  <button
                    onClick={handleSignOut}
                    className="text-background/70 hover:text-background smooth-hover text-xs font-light flex items-center gap-1"
                  >
                    <LogOut className="h-3 w-3" />
                    Sair
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Contato</h4>
            <div className="flex flex-col gap-2 mb-8">
              <a href="mailto:flaviano.filho@maisunifacisa.com" className="text-background/70 hover:text-background smooth-hover text-xs font-light flex items-center gap-2">
                <Mail className="h-3 w-3" />
                flaviano.filho@maisunifacisa.com
              </a>
            </div>

            <h4 className="text-sm font-medium mb-4">Redes</h4>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/unifacisapb/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Unifacisa"
                className="text-background/70 hover:text-background smooth-hover"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/unifacisa/?locale=pt_BR"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Unifacisa"
                className="text-background/70 hover:text-background smooth-hover"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 mt-12 text-center text-background/50 text-xs font-light">
          <p>&copy; 2026 Descubra Paraíba. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
