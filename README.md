# 🚀 IgniteGym | Multi-Tenant Management System

**IgniteGym** é uma solução robusta e escalável de **Gerenciamento de Academia**, projetada sob a arquitetura **Multi-Tenant**. O sistema permite que múltiplas unidades de academia operem de forma isolada e segura em uma única infraestrutura, gerenciando desde o controle de acesso até a saúde financeira e o desempenho dos alunos.

Este projeto funciona como um ERP (Enterprise Resource Planning) estratégico, focado na eficiência operacional e na escalabilidade do negócio fitness.

---

## 🛠️ Tecnologias Utilizadas

O ecossistema técnico foi selecionado para garantir performance e tipagem estrita:

* **Backend:** Node.js 18.x com TypeScript.
* **Interface:** React (Web/Mobile).
* **Banco de Dados:** MySQL com Sequelize ORM.
* **Infraestrutura:** Docker e Redis.
* **Segurança:** Autenticação JWT com Refresh Tokens e RBAC (Role-Based Access Control).

---

## 🏗️ Arquitetura do Sistema

### Isolamento de Dados (Multi-Tenancy)
O sistema utiliza a entidade `GymUnit` como núcleo de isolamento. Cada requisição é filtrada por um **Middleware de Tenant Isolation**, garantindo a segurança e privacidade dos dados de cada unidade.

### Principais Módulos
O banco de dados conta com **18 entidades mapeadas**, organizadas da seguinte forma:

1.  **Core:** Unidades, Usuários (Admin, Manager, Instructor, Receptionist) e Alunos.
2.  **Financeiro:** Gestão de planos, matrículas e controle de fluxo de caixa (receitas/despesas).
3.  **Treinos:** Biblioteca de exercícios e montagem de treinos personalizados.
4.  **Saúde:** Avaliações físicas detalhadas com cálculo automático de IMC.
5.  **Operacional:** Controle de acesso (Check-in), gestão de estoque (SKU) e manutenção de equipamentos.

---

## 📈 Roadmap de Desenvolvimento

| Fase | Descrição | Status |
| :--- | :--- | :--- |
| **1. Infraestrutura** | Setup de Node.js, TS, Docker e Sequelize. | ⏳ PENDENTE |
| **2. Core & Multi-Tenancy** | Implementação do isolamento por unidade e gestão de planos. | ⏳ PENDENTE |
| **3. Auth & Students** | Sistema de login JWT, RBAC e gestão de alunos. | ⏳ PENDENTE |
| **4. Financial** | Lógica de faturamento e dashboard financeiro. | ⏳ PENDENTE |
| **5. Access & Workout** | Controle de check-in e biblioteca de treinos. | ⏳ PENDENTE |
| **6. Inventory & Eval** | Avaliação física e controle de estoque/vendas. | ⏳ PENDENTE |

---

## 🔧 Instalação e Execução

Para rodar o projeto localmente:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/ignite-gym.git
    ```
2.  **Configure o Ambiente:**
    * Copie o arquivo `.env.example` para `.env` e preencha as variáveis.
3.  **Suba os Containers:**
    ```bash
    docker-compose up -d
    ```
4.  **Database Setup:**
    ```bash
    npm run db:migrate
    npm run db:seed
    ```
5.  **Inicie o Servidor:**
    ```bash
    npm run dev
    ```

---

## ✅ Checklist de Validação

- [x] Suporte a multi-tenancy (GymUnit).
- [x] 18 entidades mapeadas com relacionamentos definidos.
- [x] Sistema de permissões por cargo (RBAC).
- [x] Histórico de avaliações e progresso do aluno.
