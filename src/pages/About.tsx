import { motion } from "framer-motion";
import { MapPin, Heart, Compass, Mountain, Users, Camera } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const features = [
  {
    icon: MapPin,
    title: "Localização",
    description:
      "A plataforma ajuda a visualizar os pontos turísticos no mapa e a encontrar opções próximas quando a localização é permitida.",
  },
  {
    icon: Heart,
    title: "Categorias",
    description:
      "Praias, trilhas, natureza, cultura e patrimônio ajudam a organizar a descoberta conforme o interesse de cada pessoa.",
  },
  {
    icon: Compass,
    title: "Filtros úteis",
    description:
      "Os filtros facilitam comparar categorias, características de trilha e necessidade de guia antes de planejar uma visita.",
  },
  {
    icon: Mountain,
    title: "Mapas",
    description:
      "Os mapas reúnem os pontos cadastrados e apoiam a exploração do território paraibano.",
  },
  {
    icon: Users,
    title: "Informação em um só lugar",
    description:
      "Descrições, imagens e dados de cada ponto tornam a busca por destinos mais simples e direta.",
  },
  {
    icon: Camera,
    title: "Turismo paraibano",
    description:
      "O projeto valoriza a diversidade de lugares e experiências que a Paraíba oferece a moradores e visitantes.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navigation />

      <div className="relative aspect-video w-full overflow-hidden bg-brand-forest">
        <motion.img
          src="/images/about/sobre-farol-do-cabo-branco.jpg"
          alt="Farol do Cabo Branco, em João Pessoa, com a marca d’água maxbrito.com.br visível"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 h-full w-full object-cover object-[right_top]"
        />
      </div>

      <main>
        <section className="px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Sobre o projeto
              </span>
              <h1 className="mb-8 mt-2 text-2xl font-light tracking-tight md:text-3xl">
                Descubra Paraíba
              </h1>
              <div className="space-y-6 font-light leading-relaxed text-muted-foreground">
                <p>
                  O Descubra Paraíba é uma plataforma digital para facilitar a descoberta de pontos turísticos paraibanos.
                  Ela reúne lugares de interesse para quem deseja conhecer melhor o estado, seja morador ou visitante.
                </p>
                <p>
                  Seu objetivo é tornar a busca mais clara e prática por meio de localização, categorias, filtros e mapas.
                  Assim, cada pessoa pode explorar alternativas de acordo com seus interesses e planejar a próxima visita.
                </p>
                <p>
                  A proposta é aproximar pessoas dos destinos da Paraíba e apoiar uma experiência de turismo mais informada,
                  usando recursos digitais simples para descobrir e localizar os pontos cadastrados.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-secondary/30 px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Como funciona
              </span>
              <h2 className="mb-8 mt-2 text-2xl font-light tracking-tight md:text-3xl">
                Descoberta orientada por informação
              </h2>
              <div className="space-y-6 font-light leading-relaxed text-muted-foreground">
                <p>
                  A plataforma apresenta os pontos cadastrados em listas e no mapa, permitindo navegar por categoria
                  e acessar os detalhes de cada lugar.
                </p>
                <p>
                  Os filtros ajudam a refinar a pesquisa por características relevantes, enquanto a localização,
                  quando autorizada, permite visualizar distâncias e ordenar os resultados.
                </p>
                <p>
                  Dessa forma, o Descubra Paraíba busca oferecer um ponto de partida digital para explorar o turismo
                  da Paraíba com mais contexto e autonomia.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Recursos
              </span>
              <h2 className="mt-2 text-2xl font-light tracking-tight md:text-3xl">
                Ferramentas para descobrir a Paraíba
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-lg border border-border bg-card p-8 shadow-soft transition-shadow duration-300 hover:shadow-md"
                >
                  <feature.icon className="mb-4 h-6 w-6 text-primary" />
                  <h3 className="mb-3 text-lg font-light tracking-tight">{feature.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
