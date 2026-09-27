---
description: Diretrizes de desenvolvimento, experiência do usuário e validação da aplicação IA.I Finanças.
applyTo: "**"
---

# 1. Contexto do projeto

O IA.I Finanças é um protótipo de evolução da experiência de controle financeiro do aplicativo Itaú, desenvolvido para um hackathon.

A solução combina visualização inteligente de gastos, assistência financeira por IA e educação financeira gamificada para incentivar jovens a acompanhar suas finanças durante 90 dias.

O projeto deve aproveitar conceitualmente as funcionalidades existentes da IA.I, evitando recriar recursos que já fazem parte da experiência atual.

O protótipo não deve ser apresentado como um produto oficial do Itaú nem pressupor acesso a APIs internas do banco.

# 2. Público-alvo e problema

## Persona principal

Jovem de 18 anos, no primeiro emprego, que:

- Possui pouco tempo para organizar suas finanças.
- Está começando a receber seu próprio salário.
- Tem conhecimentos limitados sobre planejamento financeiro e investimentos.
- Utiliza principalmente o celular.
- Prefere informações visuais, objetivas e interativas.
- Precisa transformar educação financeira em hábitos práticos.

## Problema

O usuário tem acesso às informações de suas transações, mas pode apresentar dificuldades para interpretar os gastos, organizar seu orçamento e identificar oportunidades de economizar ou investir.

## Objetivo

Transformar o acompanhamento financeiro em um hábito por meio de uma experiência simples, personalizada e gamificada.

O indicador principal do projeto será a retenção e o engajamento financeiro ao longo de 90 dias.

# 3. Funcionalidades principais

## 3.1. Painel financeiro inteligente

Adicionar um painel de controle financeiro à página de extrato do aplicativo, posicionado antes da listagem de transações.

O painel deve apresentar:

- Saldo disponível.
- Total de entradas e saídas do período.
- Distribuição de despesas por categoria.
- Gráficos interativos de gastos.
- Comparação de despesas entre períodos.
- Identificação das categorias com maiores gastos.
- Evolução do orçamento e das metas financeiras.
- Sugestões contextualizadas da IA.I.

Priorizar gráficos de barras, linhas e rosca, selecionando a visualização mais adequada para cada informação.

Permitir filtros por período e categoria.

O extrato original deve permanecer acessível e preservar sua funcionalidade.

## 3.2. Assistente IA.I

A IA.I deve atuar como uma assistente de educação e organização financeira.

Suas principais funções serão:

- Explicar os gráficos em linguagem simples.
- Identificar padrões de consumo.
- Apresentar comparações entre períodos.
- Sugerir oportunidades de economia.
- Explicar conceitos financeiros.
- Auxiliar na definição de metas.
- Recomendar desafios educativos relacionados aos hábitos do usuário.

As respostas devem ser curtas, contextualizadas e adequadas ao conhecimento financeiro da persona.

Não apresentar sugestões de investimento como garantias de rentabilidade ou recomendações individualizadas sem informações suficientes.

Utilizar exclusivamente dados simulados ou autorizados.

Para o hackathon, a IA pode ser simulada por respostas determinísticas ou integrada a um serviço autorizado, conforme as dependências e credenciais disponíveis.

# 4. Jornada gamificada de 90 dias

A jornada será composta por 12 etapas semanais, organizadas em três fases de quatro semanas e distribuídas ao longo de 90 dias. As semanas 1 a 4 formam a fase Entender; as semanas 5 a 8, Planejar; e as semanas 9 a 12, Conquistar. Os dias 85 a 90 ficam reservados para revisão e celebração da conclusão.

Cada etapa deverá conter:

1. Um conteúdo educativo breve.
2. Um exemplo relacionado à realidade da persona.
3. Um desafio prático.
4. Um feedback após a conclusão.
5. Atualização do progresso.

Os conteúdos devem ser rápidos, preferencialmente concluídos em até cinco minutos, sem considerar o tempo necessário para executar ações financeiras externas.

## 4.1. Trilha educativa sugerida

### Etapa 1 — Entender

Semana 1: Conheça seu dinheiro.

Semana 2: Descubra seus maiores gastos.

Semana 3: Gastos fixos e variáveis.

Semana 4: Seu primeiro orçamento.

### Etapa 2 — Planejar

Semana 5: Defina seus limites.

Semana 6: Entenda o cartão de crédito.

Semana 7: Planeje seu salário.

Semana 8: Crie sua primeira meta.

### Etapa 3 — Conquistar

Semana 9: Conheça os Cofrinhos.

Semana 10: Monte sua reserva.

Semana 11: Aprenda sobre investimentos.

Semana 12: Seu plano para o futuro.

## 4.2. Regras de progressão

- Liberar um novo desafio a cada segunda-feira; se o participante não acessar nesse dia, apresentá-lo no próximo acesso.
- Encerrar a liberação de desafios após a 12ª semana e reservar os dias restantes até o dia 90 para revisão e celebração.
- Permitir a conclusão de etapas anteriores em atraso.
- Não aplicar punições por semanas perdidas.
- Não zerar o progresso por inatividade.
- Permitir que o usuário retome a jornada de onde parou.
- Exibir etapas concluídas, pendentes e bloqueadas.
- Apresentar uma barra de progresso geral.
- Celebrar conquistas sem estimular comportamentos financeiros arriscados.

A recompensa final será considerada somente após a conclusão das 12 etapas e dos 90 dias, além do cumprimento das condições do experimento. No protótipo, qualquer resgate será apenas simulado.

A conclusão antecipada das atividades em atraso não deve antecipar automaticamente o encerramento do período de 90 dias.

# 5. Experimento de recompensas

Criar três grupos experimentais para avaliar o impacto de diferentes incentivos na conclusão da jornada e na retenção.

## Grupo A — Crédito na loja Itaú

Recompensa proposta: R$ 100 para utilizar na loja Itaú após concluir a jornada.

## Grupo B — Rentabilidade adicional

Recompensa proposta: rentabilidade adicional de 10% sobre a taxa-base aplicável ao Cofrinho, durante três meses após a conclusão.

Não interpretar o benefício como acréscimo de dez pontos percentuais.

## Grupo C — Incentivo ao investimento

Recompensa proposta: aporte promocional equivalente a 5% do valor investido pelo participante, conforme condições definidas para o experimento.

## Regras do experimento

- Cada participante deve pertencer a apenas um grupo.
- Manter a atribuição do grupo durante todo o experimento.
- Utilizar distribuição aleatória e equilibrada no protótipo.
- Apresentar claramente as condições de cada recompensa.
- Não conceder recompensas reais no ambiente de demonstração.
- Simular a conclusão e o recebimento do benefício.

Antes de qualquer implementação real, os benefícios dependerão de aprovação do Itaú, definição de elegibilidade, limites financeiros, condições promocionais e validação jurídica e regulatória.

Os três grupos devem receber a mesma experiência educativa, alterando-se apenas a recompensa final.

# 6. Indicadores de sucesso

Instrumentar o protótipo para demonstrar os seguintes indicadores:

## Indicador principal

Retenção no dia 90: percentual de usuários que retornam e realizam uma interação financeira relevante no aplicativo no período definido para a medição.

## Indicadores secundários

- Taxa de adesão à jornada.
- Taxa de conclusão semanal.
- Taxa de conclusão dos 90 dias.
- Número de interações com o painel financeiro.
- Frequência de acompanhamento dos gastos.
- Percentual de desafios concluídos.
- Evolução do conhecimento financeiro.
- Conversão simulada para o Cofrinho.
- Retenção e conclusão por grupo experimental.

Distinguir usuários que abriram o aplicativo daqueles que efetivamente acompanharam suas finanças.

Não apresentar resultados simulados como evidência de eficácia real.

# 7. Stack tecnológica

- Node.js 22+
- Next.js 15 com App Router
- React 19
- TypeScript em modo strict
- Tailwind CSS 3
- Jest com jsdom

Utilizar as dependências já existentes no projeto.

Não instalar bibliotecas adicionais sem necessidade justificada.

# 8. Estrutura de diretórios

src/
app/
layout.tsx
page.tsx
globals.css
extrato/
jornada/
recompensas/
api/
components/
ui/
dashboard/
charts/
journey/
rewards/
lib/
api.ts
types.ts
constants.ts
finance.ts
gamification.ts
experiments.ts
hooks/
**tests**/

A estrutura representa a organização desejada. Não criar diretórios desnecessários ou reorganizar código existente sem justificativa.

# 9. Regras de implementação

## Arquitetura

- Utilizar TypeScript e componentes funcionais.
- Preservar a separação entre Server Components e Client Components.
- Adicionar "use client" somente quando necessário.
- Utilizar o alias @/\* para imports internos.
- Centralizar integrações externas em src/lib/api.ts.
- Reutilizar os tipos definidos em src/lib/types.ts.
- Centralizar regras financeiras em src/lib/finance.ts.
- Centralizar regras de progressão em src/lib/gamification.ts.
- Isolar a lógica dos grupos experimentais em src/lib/experiments.ts.
- Separar regras de negócio dos componentes visuais.
- Evitar duplicação de código.

## Dados e integração

Utilizar dados financeiros fictícios e coerentes para a demonstração.

As integrações devem ser desacopladas, permitindo substituir dados simulados por APIs autorizadas futuramente.

Não implementar acesso a contas bancárias reais, movimentações financeiras ou concessão de recompensas reais.

Não adicionar persistência ou novas dependências sem solicitação explícita, salvo quando indispensáveis. Nesse caso, explicar a necessidade antes da alteração.

## Qualidade

- Preservar funcionalidades existentes.
- Não realizar refatorações não relacionadas à tarefa.
- Evitar componentes excessivamente grandes.
- Utilizar nomes claros e consistentes.
- Tratar estados de carregamento, erro e ausência de dados.
- Evitar cálculos financeiros diretamente no JSX.
- Evitar valores monetários definidos diretamente nos componentes.

# 10. Design e experiência do usuário

Adotar uma experiência mobile-first, compatível com a identidade visual existente do Itaú.

Priorizar:

- Navegação simples.
- Textos curtos.
- Gráficos legíveis em telas pequenas.
- Hierarquia visual clara.
- Botões e áreas de toque acessíveis.
- Feedback imediato após ações.
- Linguagem adequada a jovens iniciantes.
- Gamificação discreta e motivadora.

O painel financeiro deve aparecer antes do extrato, sem dificultar o acesso às transações.

Evitar excesso de notificações, animações ou elementos competitivos que prejudiquem a experiência.

Utilizar Tailwind CSS e respeitar os padrões visuais já implementados.

# 11. Segurança e responsabilidade financeira

A IA deve respeitar as diretrizes de uso e segurança disponibilizadas pelo Itaú e aplicáveis ao projeto.

Na ausência de documentação interna, não presumir regras proprietárias.

- Não solicitar senhas, tokens bancários ou credenciais.
- Não expor informações financeiras sensíveis em logs.
- Não utilizar dados pessoais reais no protótipo.
- Não inventar saldos, transações ou rendimentos apresentados como reais.
- Não garantir resultados financeiros.
- Não incentivar endividamento para cumprir desafios.
- Não condicionar a educação financeira à contratação de produtos.
- Identificar claramente conteúdos e resultados simulados.

Qualquer integração real deverá passar por avaliação de segurança, privacidade e conformidade do banco.

# 12. Acessibilidade

Utilizar HTML semântico e controles acessíveis.

Todos os elementos interativos devem funcionar por teclado.

Não comunicar estados exclusivamente por cores.

Gráficos devem possuir títulos, legendas e alternativas textuais que permitam compreender os dados.

Utilizar mensagens de erro compreensíveis e feedback acessível para mudanças de estado.

# 13. Testes

Criar ou atualizar testes para regras de negócio relevantes, especialmente:

- Cálculo de entradas e saídas.
- Agregação de despesas por categoria.
- Cálculo de percentuais.
- Comparação entre períodos.
- Liberação das etapas semanais.
- Recuperação de semanas em atraso.
- Conclusão da jornada.
- Atribuição e manutenção dos grupos experimentais.
- Cálculo simulado das recompensas.
- Tratamento de dados ausentes ou inválidos.

Testes financeiros devem incluir valores-limite, arredondamentos e casos sem movimentações.

# 14. Validação obrigatória

Antes de concluir qualquer alteração:

1. Verificar o painel Problems do VS Code, quando disponível.
2. Executar npm run lint após alterações de código.
3. Executar npm test -- --runInBand quando existirem testes ou forem alterados comportamentos testados.
4. Executar npm run build após alterações estruturais ou antes da entrega de uma funcionalidade.
5. Validar alterações visuais e interativas no navegador.
6. Verificar a ausência de novos erros no console.

Se um comando falhar, informar o erro e não declarar a tarefa concluída sem explicar a falha.

Se não houver acesso ao VS Code, navegador, console ou terminal, informar quais verificações não puderam ser realizadas.

# 15. Fluxo de trabalho do assistente de desenvolvimento

Antes de implementar uma funcionalidade:

1. Inspecionar os arquivos relevantes e identificar os padrões existentes.
2. Verificar se a funcionalidade já está implementada.
3. Identificar os componentes e as regras de negócio afetados.
4. Planejar a menor alteração necessária.
5. Implementar sem modificar comportamentos não relacionados.
6. Criar ou atualizar os testes pertinentes.
7. Executar as validações obrigatórias.
8. Resumir as alterações e informar eventuais limitações.

Não declarar que testes ou validações foram realizados sem executá-los.

Priorizar sempre uma implementação funcional, simples, demonstrável e coerente com o objetivo do hackathon.
