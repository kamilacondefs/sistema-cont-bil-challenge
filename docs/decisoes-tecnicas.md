# Decisões Técnicas 
 
## Arquitetura 
- **Módulos vs Standalone**: Todos os componentes são standalone para acompanhar a tendência do Angular moderno e facilitar o tree-shaking. 
- **Separação de responsabilidades**: Components são responsáveis apenas pela view. Toda lógica de negócio e chamadas HTTP estão nos Services. 
- **Interceptors funcionais**: Usados ao invés de classes para compatibilidade com Angular 20 e menos boilerplate. 
 
## Estado e Dados 
- **Sem state management global** (ex: NgRx): O projeto não requer complexidade de estado que justifique um store. Os Services com BehaviorSubject são suficientes para compartilhar dados entre componentes quando necessário. 
- **Paginação server-side**: A paginação é feita no servidor, não no cliente. Isso garante performance com 5000 lançamentos. 
- **Filtros via query params da API**: Os filtros são passados diretamente como HttpParams para o endpoint, sem necessidade de filtrar no cliente. 
 
## Autenticação 
- **Token em memória**: O token é armazenado em memória (service) ao invés de localStorage para este mock. Em produção, considere usar um mecanismo mais seguro. 
- **Login automático no mock**: Como o token é fixo, o AuthService faz login automático ao inicializar para simplificar o desenvolvimento. 
 
## UI/UX 
- **Angular Material**: Usado para datepicker e autocomplete, que são componentes complexos que não vale recriar do zero. 
- **Toast via service**: Implementado como service + componente para permitir mostrar notificações de qualquer lugar da aplicação sem props drilling. 
- **Debounce na busca**: A busca por texto usa debounceTime de 500ms para evitar chamadas desnecessárias à API enquanto o usuário digita. 
 
## Testes 
- **Cobertura mínima de 70%**: Configurada no Angular CLI para garantir que a cobertura não caia abaixo do limite. 
- **HttpTestingController**: Usado ao invés de mocks manuais para testar chamadas HTTP de forma mais confiável. 
- **CUSTOM_ELEMENTS_SCHEMA**: Usado nos testes de componentes pai para isolá-los dos componentes filhos. 
