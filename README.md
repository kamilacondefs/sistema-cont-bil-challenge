# Sistema Contábil 
 
 Sistema de lançamentos contábeis modernizado em Angular 20. 

 ## 🎨 Design

**Protótipo Navegável:**
[Link do Protótipo]([cole-seu-link-aqui](https://www.figma.com/proto/I3ifhKmsgjtV4jfuL4FKrg/Desafio-T%C3%A9cnico---Bip-Brasil--KAMILA-CONDE-?node-id=1-855&t=L7UcmImK0DXNQErx-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A786))

**Link do arquivo no Figma Design:**
[Link do Design]([cole-seu-link-aqui](https://www.figma.com/design/I3ifhKmsgjtV4jfuL4FKrg/Desafio-T%C3%A9cnico---Bip-Brasil--KAMILA-CONDE-?node-id=2-753&t=9mn3iWwFZdmX3ael-1))

Detalhes sobre as decisões de design estão documentados em `docs/figma-handoff.md`.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico para modernização de um sistema legado de lançamentos contábeis, para a empresa Bip Brasil, por Kamila Condè.

 
 ## Pré-requisitos 
 - Node.js 18+ 
 - npm 9+ 
 - Angular CLI instalado globalmente: npm install -g @angular/cli 
 
 ## Como rodar 
 
 ### 1. API Mock (em outro terminal) 
 cd api-mock 
 npm install 
 npm run seed 
 npm start 
 
 A API estará disponível em http://localhost:3000 
 
 ### 2. Aplicação Angular 
 npm install 
 ng serve 
 
 A aplicação estará disponível em http://localhost:4200 
 
 ## Como testar 
 npm test 
 npm test -- --coverage 
 
 ## Estrutura do Projeto 
 src/app/ 
   core/          — Enums, constantes, modelos, interceptors e services base 
   shared/        — Componentes e pipes reutilizáveis (Toast, currencyFormat) 
   features/      — Componentes de feature (dashboard, lancamento-form) 
 
 docs/            — Documentação técnica e handoff do Figma 
