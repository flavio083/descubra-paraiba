# Descubra Paraíba

Plataforma de turismo para descobrir e explorar os pontos turísticos da Paraíba: praias, trilhas, formações naturais, patrimônio histórico e cultura.

## Funcionalidades

- Listagem e busca de atrações turísticas da Paraíba
- Mapa interativo com todos os pontos cadastrados (Leaflet + OpenStreetMap)
- Filtros por categoria, região e município
- Geolocalização para explorar destinos próximos
- Página individual de cada atração com detalhes, imagens e mapa
- Painel administrativo (acesso restrito) para cadastro e edição de atrações
- Autenticação segura via Supabase Auth

## Tecnologias

- **Frontend:** React 18 + TypeScript + Vite
- **Estilo:** Tailwind CSS + shadcn/ui
- **Banco de dados e autenticação:** Supabase (PostgreSQL + RLS)
- **Mapa:** Leaflet + OpenStreetMap
- **Animações:** Framer Motion
- **Roteamento:** React Router DOM

## Desenvolvimento local

Requer Node.js e npm.

```sh
git clone <url-do-repositório>
cd gentle-wild-spots
npm install
npm run dev
```

Configure as variáveis de ambiente copiando `.env.example` (se disponível) ou criando um `.env.local` com as credenciais do Supabase:

```
VITE_SUPABASE_URL=sua_url
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
```

## Build de produção

```sh
npm run build
```
