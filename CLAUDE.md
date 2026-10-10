# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Portfólio pessoal de Thiago Martins: SPA em React 18 criada com Create React App (`react-scripts` 5), sem backend. Todo o texto da interface, do conteúdo e dos commits é em **pt-BR**. Site publicado: https://thiagodmartins.dev.

## Comandos

```bash
npm install                 # node_modules não é versionado
npm run dev                 # dev server; porta lida de .env.development.local (PORT=3070)
npm start                   # mesmo dev server, mas com .env.production.local (PORT=3080)
npm run build               # build de produção em ./build
npm run lint                # ESLint (.js/.jsx) — roda no CI
npm run lint:styles         # Stylelint em todos os .css — roda no CI
npm test                    # Jest em modo watch (react-scripts test)
CI=true npm test -- src/App.test.js        # um arquivo, sem watch
CI=true npm test -- -t "nome do teste"     # um teste pelo nome
npm run compose:up:dev      # container dev (hot reload via volumes de src/ e public/)
npm run compose:up:prod     # container nginx com o build, porta 3080
```

Os scripts `dev`/`start`/`build` carregam `.env.*.local` via `node -r dotenv/config`. Crie esses arquivos a partir dos `.example` (estão no `.gitignore`). Os scripts `compose:*` usam o binário legado `docker-compose`.

## Arquitetura

- **O conteúdo fica todo em [src/database/data.json](src/database/data.json).** Os componentes importam o JSON direto, sem props, Context ou estado global. Alterar experiência, educação, skills, projetos, contatos ou o link do currículo é editar só esse arquivo; a maioria dos commits é `chore(data.json): ...`. Chaves principais: `profile` (incluindo `description.paragraphs`, `contacts`, `otherInformations`), `professional` (`experience`, `education`, `skills`) e `projectsSection.projects`.
- **Strings com HTML.** `profile.description.paragraphs` e os `description[]` de experiência e educação são renderizados com `dangerouslySetInnerHTML` (a regra `react/no-danger` está desativada de propósito em `.eslintrc.json`). Os links dentro dessas strings usam aspas simples e classes por empresa/instituição (`link-trybe`, `link-prodados`, `link-avoque-consultores`, `link-ifes`, `link-coursera`...). Essas classes ficam em `src/components/About/index.css` e `src/components/Resume/index.css`. No CRA todo CSS importado é global, então uma classe definida em um arquivo vale para a página inteira. Uma instituição nova precisa de uma classe nova em um desses arquivos.
- **Navegação sem rotas.** Existe só a rota `/` (`App.jsx` → `pages/Home`, que renderiza `Profile` + `MainCard`). As abas Sobre/Resumo/Projetos são definidas no array `NAVBAR_OPTIONS` do `MainCard` (`id`, `label` do botão, `title` exibido e o componente `Content`). O estado guarda só o `id` da aba selecionada, e a aba ativa recebe a classe `navbar-option-active` e `aria-pressed`. O `<article>` usa `key` com o `id` da aba, então cada troca recria o card, o que reinicia a animação de fade e a rolagem interna do card (no desktop, quem rola é o card). Abaixo de 1250px quem rola é a página inteira, por isso `selectOption` também chama `window.scrollTo(0, 0)` ao trocar de aba. Como o jsdom não implementa `window.scrollTo`, o teste do `MainCard` o substitui por um `jest.fn()`. Para criar uma aba nova, basta adicionar um item ao `NAVBAR_OPTIONS`.
- **Responsividade.** Media queries em 1249 / 1023 / 767 / 579 / 480px. Abaixo de 1249px a navbar vira barra fixa no rodapé e o `Profile` vira um menu expansível. O botão desse menu é sempre renderizado, e só o CSS decide quando ele aparece (abaixo de 1249px) e se mostra o texto "More Info" ou a seta (abaixo de 579px). Não leia `window.innerWidth` para isso: os breakpoints ficam apenas no CSS.
- **Assets.** Caminhos locais começam com `/assets/...` e são servidos de `public/assets/`. Imagens de projetos ficam em `public/assets/projects-images/`. Quase todos os ícones de skills são URLs externas (svgrepo etc.).
- **Foto de perfil e ícones.** A foto (`public/assets/thiago-martins.webp`) é um WebP de 320×320, o dobro dos 160px máximos que ela ocupa na tela (para telas de alta densidade). Os ícones são gerados a partir da mesma foto:
  - `public/favicon.ico` (16/32/48px), usado no `index.html` e no `manifest.json`;
  - `public/logo192.png` e `public/logo512.png`, usados no `manifest.json`;
  - `public/apple-touch-icon.png` (180px), com fundo `#121212` no lugar da transparência, porque o iOS preenche transparência com preto.
  - Ao trocar a foto, gere todos esses arquivos de novo. Ícones ficam em PNG/ICO, não em WebP, porque o iOS e alguns navegadores não aceitam WebP nesses usos.

## Convenções de código

- **ESLint** usa `@trybe/eslint-config-frontend`: espaços dentro das chaves no JSX (`{ value }`, `className={ x }`), aspas simples e indentação de 2 espaços.
- **Stylelint** (`.stylelintrc.json`) é estrito:
  - propriedades em **ordem alfabética** (`stylelint-order`);
  - media queries no formato `@media screen and ( max-width : 1249px )`;
  - linha em branco antes de cada at-rule, aspas simples, cores hex em minúsculo/curtas;
  - proibido `!important`, prefixos de vendor e seletores qualificados por tipo.
- O CSS existente usa `0.001px` onde o valor seria zero. Siga o padrão do arquivo que estiver editando.
- Cada componente tem `index.jsx` + `index.css` na própria pasta.
- A fonte Poppins é carregada **uma única vez**, por um `<link>` no `public/index.html`, com os pesos `200;400;600`. Não use `@import` de fontes nos CSS. Se passar a usar um peso novo em `font-weight`, adicione-o nessa URL.
- As tags `<b>` do `data.json` usam o padrão do navegador (`bolder`), que é relativo ao texto em volta: nos parágrafos com peso `200`, o negrito fica com peso `400`. Isso é intencional, porque o peso `700` foi testado e achado agressivo demais. Não force `font-weight` no `<b>`.
- **Commits** seguem [Conventional Commits](https://www.conventionalcommits.org) + gitmoji, em pt-BR. O formato é `tipo(escopo): :gitmoji: Descrição`, com corpo opcional explicando o porquê.
  - O tipo segue a natureza da mudança (`feat`, `fix`, `refactor`, `test`, `ci`, `docs`, `chore`...).
  - O gitmoji corresponde ao tipo.
  - O escopo é o nome do arquivo alterado (`data.json`, `index.css`, `index.yml`, `README.md`...).
  - Exemplos: `chore(data.json): ...`, `test(App.test.js): :white_check_mark: ...`, `ci(index.yml): :construction_worker: ...`.
  - Siga o padrão, não os commits antigos: alguns não têm escopo ou gitmoji.

## CI/CD e branches

- O trabalho é feito em `dev-thiago-martins` e entra por PR na `main`.
- A `main` é protegida: o merge exige que os checks `Run linters ESLint and Stylelint`, `Run tests` e `Build Application` passem. **Não renomeie esses jobs** sem atualizar também a regra de proteção no GitHub, senão os PRs ficam esperando um check que nunca chega.
- `.github/workflows/index.yml` só valida e não faz deploy. Ele roda em PRs para a `main` e em `push` na `main`: `linters` (`lint` + `lint:styles`) e `tests` (`npm test -- --watchAll=false`) rodam em paralelo, e `build` só roda se os dois passarem.
- **O deploy é feito pela Vercel**, pela integração com o Git (preview em cada PR e produção no merge na `main`). Não há configuração da Vercel no repositório.
- O deploy antigo no GitHub Pages (branch `gh-pages`) foi desativado. A história está registrada no README; não recrie esse job.
- O GitHub Actions define `CI=true`. Com isso, o `react-scripts build` trata warnings do ESLint como erro, e os testes rodam uma única vez.
- O CI usa Node 24 com `npm ci`, então o `package-lock.json` precisa estar sincronizado com o `package.json`. Lint e build foram validados no Node 22 e 24; no 24 aparece só um aviso de depreciação (`fs.F_OK`), que não afeta o build.
- Rodar `npm run lint:styles` depois de um build local também analisa o CSS minificado em `build/` e gera milhares de erros. Apague `build/` antes.
- **Docker** tem um Dockerfile por ambiente, ambos com Node 24:
  - `Dockerfile.dev`, usado pelo `docker-compose.dev.yaml`: roda `npm run dev` na porta 3070, com `src/` e `public/` montados como volume para o hot reload;
  - `Dockerfile.prod`, usado pelo `docker-compose.prod.yaml`: multi-stage, compila no estágio `node` e a imagem final só tem o `nginx:alpine` com o conteúdo de `build/` (~46 MB).
  - Os dois copiam `package.json` e `package-lock.json` antes do código e usam `npm ci`, para aproveitar o cache de camadas do Docker.
  - O `docker-compose.prod.yaml` exige o arquivo `.env.production.local` (crie a partir do `.example`), mesmo o nginx não usando a variável `PORT`.

## Armadilhas conhecidas

- Testes: `src/App.test.js` é um smoke test que renderiza o `App` dentro de um `MemoryRouter`, e `src/components/MainCard/index.test.js` testa a troca de abas. Eles dependem do `profile.myName` do `data.json` e dos `label`/`title` do `NAVBAR_OPTIONS`; se você alterar algum deles, atualize os testes. Arquivos `*.test.js` estão no `.eslintignore`.
