import { motion } from "framer-motion";
import { Facebook, Instagram, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navigation />

    <main className="pt-28 pb-20">
      <div className="container mx-auto max-w-3xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Contato
          </span>
          <h1 className="mt-2 text-3xl font-light tracking-tight md:text-4xl">
            Fale com o Descubra Paraíba
          </h1>
          <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
            Entre em contato para acompanhar o projeto e suas informações sobre o
            turismo da Paraíba.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Card className="border border-border p-5 shadow-soft">
            <Mail className="mb-3 h-5 w-5 text-primary" />
            <h2 className="text-sm font-normal">E-mail</h2>
            <a
              href="mailto:flaviano.filho@maisunifacisa.com"
              className="mt-2 block break-all text-xs font-light text-muted-foreground hover:text-primary"
            >
              flaviano.filho@maisunifacisa.com
            </a>
          </Card>

          <Card className="border border-border p-5 shadow-soft">
            <Instagram className="mb-3 h-5 w-5 text-primary" />
            <h2 className="text-sm font-normal">Instagram</h2>
            <Button asChild variant="link" className="mt-1 h-auto px-0 text-xs font-light">
              <a href="https://www.instagram.com/unifacisapb/" target="_blank" rel="noopener noreferrer">
                Abrir perfil
              </a>
            </Button>
          </Card>

          <Card className="border border-border p-5 shadow-soft">
            <Facebook className="mb-3 h-5 w-5 text-primary" />
            <h2 className="text-sm font-normal">Facebook</h2>
            <Button asChild variant="link" className="mt-1 h-auto px-0 text-xs font-light">
              <a href="https://www.facebook.com/unifacisa/?locale=pt_BR" target="_blank" rel="noopener noreferrer">
                Abrir perfil
              </a>
            </Button>
          </Card>
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

export default Contact;
