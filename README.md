# Descubra Paraíba

Plataforma para descobrir pontos turísticos da Paraíba, consultar informações sobre os destinos e explorar sua localização no mapa.

## Funcionalidades

- Busca e filtros de atrações por categorias e características.
- Mapa interativo com Leaflet e OpenStreetMap.
- Geolocalização para consultar distâncias e ordenar atrações próximas.
- Páginas com detalhes das atrações cadastradas.
- Autenticação e painel administrativo para gestão de atrações.

## Tecnologias

- React, TypeScript e Vite.
- Tailwind CSS e shadcn/ui.
- Supabase para dados e autenticação.
- Leaflet e OpenStreetMap.
- Framer Motion.

## Pré-requisitos

- Node.js.
- npm (incluído com Node.js).

## Configuração local

No terminal, clone o repositório e entre na pasta do projeto:

```powershell
git clone https://github.com/flavio083/descubra-paraiba.git
cd descubra-paraiba
npm.cmd ci
Copy-Item .env.example .env
```

Abra o arquivo `.env` local e preencha:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Use a URL do projeto Supabase e sua chave pública (publishable/anon) fornecidas pelo responsável pelo projeto. Cada integrante deve manter seu próprio `.env` local. Esse arquivo é ignorado pelo Git e não deve ser enviado ao GitHub.

Somente a chave pública apropriada para uso no frontend deve ser configurada. Nunca coloque `service_role` ou secret keys em variáveis `VITE_*`: essas variáveis são incorporadas ao código entregue ao navegador.

Inicie o servidor de desenvolvimento:

```powershell
npm.cmd run dev
```

O Vite informa o endereço local no terminal; com a configuração atual, o endereço é `http://localhost:8080`.

## Build de produção

```powershell
npm.cmd run build
```
