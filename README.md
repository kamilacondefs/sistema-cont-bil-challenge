# Sistema Contábil 
 
 Sistema de lançamentos contábeis modernizado em Angular 20. 
 
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
