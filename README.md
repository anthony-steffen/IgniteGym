# IgniteGym

# Sistema de Gerenciamento de Academia

## Sobre o Projeto

[Descrição breve]

## Diagrama Entidade-Relacionamento

# 🏋️ DIAGRAMA ENTIDADE-RELACIONAMENTO (DER)

## Sistema de Gerenciamento de Academia - Multi-Tenant

---

## 📊 LEGENDA

- **PK** = Primary Key (Chave Primária)
- **FK** = Foreign Key (Chave Estrangeira)
- **UK** = Unique Key (Chave Única)
- **1:N** = Um para Muitos
- **N:M** = Muitos para Muitos

---

## 🏢 CATEGORIA: CORE (Entidades Principais)

### 1. GymUnit (Unidade da Academia)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| name | String | - | Nome da unidade |
| cnpj | String | UK | CNPJ da unidade |
| email | String | - | Email de contato |
| phone | String | - | Telefone |
| address | String | - | Endereço completo |
| settings | JSON | - | Configurações específicas |
| isActive | Boolean | - | Unidade ativa/inativa |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- GymUnit **1:N** User (uma unidade tem vários usuários)
- GymUnit **1:N** Student (uma unidade tem vários alunos)
- GymUnit **1:N** Plan (uma unidade tem vários planos)
- GymUnit **1:N** Equipment (uma unidade tem vários equipamentos)
- GymUnit **1:N** Product (uma unidade tem vários produtos)

---

### 2. User (Usuário/Funcionário)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| gymUnitId | UUID | FK | Referência à unidade |
| email | String | UK | Email único |
| password | String | - | Senha (hash bcrypt) |
| name | String | - | Nome completo |
| role | Enum | - | admin, manager, instructor, receptionist |
| isActive | Boolean | - | Usuário ativo/inativo |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- User **N:1** GymUnit
- User **1:N** CheckIn (como registrador)
- User **1:N** Workout (como instrutor)
- User **1:N** PhysicalEvaluation (como avaliador)

---

### 3. Student (Aluno)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| gymUnitId | UUID | FK | Referência à unidade |
| name | String | - | Nome completo |
| email | String | UK | Email único |
| cpf | String | UK | CPF único |
| phone | String | - | Telefone |
| birthDate | Date | - | Data de nascimento |
| address | String | - | Endereço completo |
| status | Enum | - | active, inactive, suspended |
| photo | String | - | URL da foto |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- Student **N:1** GymUnit
- Student **1:N** Enrollment
- Student **1:N** CheckIn
- Student **1:N** Workout
- Student **1:N** PhysicalEvaluation
- Student **1:N** Financial
- Student **1:N** Sale

---

## 💰 CATEGORIA: FINANCEIRO

### 4. Plan (Plano)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| gymUnitId | UUID | FK | Referência à unidade |
| name | String | - | Nome do plano |
| description | Text | - | Descrição detalhada |
| price | Decimal | - | Preço mensal |
| durationDays | Integer | - | Duração em dias |
| hasAccessControl | Boolean | - | Controla acesso? |
| maxCheckInsPerDay | Integer | - | Limite de check-ins/dia |
| isActive | Boolean | - | Plano ativo/inativo |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- Plan **N:1** GymUnit
- Plan **1:N** Enrollment

---

### 5. Enrollment (Matrícula)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| studentId | UUID | FK | Referência ao aluno |
| planId | UUID | FK | Referência ao plano |
| startDate | Date | - | Data de início |
| endDate | Date | - | Data de término |
| status | Enum | - | active, expired, cancelled |
| discount | Decimal | - | Desconto aplicado |
| finalPrice | Decimal | - | Preço final |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- Enrollment **N:1** Student
- Enrollment **N:1** Plan
- Enrollment **1:N** Financial

---

### 6. Financial (Controle Financeiro)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| gymUnitId | UUID | FK | Referência à unidade |
| studentId | UUID | FK (null) | Referência ao aluno |
| enrollmentId | UUID | FK (null) | Referência à matrícula |
| type | Enum | - | income, expense |
| category | Enum | - | membership, product, salary, maintenance, other |
| description | Text | - | Descrição da transação |
| amount | Decimal | - | Valor |
| dueDate | Date | - | Data de vencimento |
| paymentDate | Date | - | Data de pagamento |
| status | Enum | - | pending, paid, overdue, cancelled |
| paymentMethod | Enum | - | cash, credit, debit, pix, boleto |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- Financial **N:1** GymUnit
- Financial **N:1** Student
- Financial **N:1** Enrollment

---

## 🚪 CATEGORIA: CONTROLE DE ACESSO

### 7. CheckIn (Check-in/Check-out)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| studentId | UUID | FK | Referência ao aluno |
| gymUnitId | UUID | FK | Referência à unidade |
| userId | UUID | FK | Quem registrou o check-in |
| checkInTime | DateTime | - | Horário de entrada |
| checkOutTime | DateTime | - | Horário de saída |
| createdAt | DateTime | - | Data de criação |

**Relacionamentos:**

- CheckIn **N:1** Student
- CheckIn **N:1** GymUnit
- CheckIn **N:1** User (registrador)

---

## 🏋️ CATEGORIA: TREINOS

### 8. Exercise (Exercício)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| gymUnitId | UUID | FK | Referência à unidade |
| name | String | - | Nome do exercício |
| description | Text | - | Descrição detalhada |
| videoUrl | String | - | URL do vídeo demonstrativo |
| category | Enum | - | strength, cardio, flexibility, functional |
| muscleGroup | Enum | - | chest, back, legs, arms, core, shoulders |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- Exercise **N:1** GymUnit
- Exercise **N:M** Workout (via WorkoutExercise)

---

### 9. Workout (Treino)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| studentId | UUID | FK | Referência ao aluno |
| instructorId | UUID | FK | Referência ao instrutor (User) |
| name | String | - | Nome do treino |
| objective | Text | - | Objetivo do treino |
| startDate | Date | - | Data de início |
| endDate | Date | - | Data de término |
| status | Enum | - | active, completed, cancelled |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- Workout **N:1** Student
- Workout **N:1** User (instrutor)
- Workout **1:N** WorkoutExercise

---

### 10. WorkoutExercise (Exercício do Treino)

**Tabela de Relacionamento N:M entre Workout e Exercise**

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| workoutId | UUID | FK | Referência ao treino |
| exerciseId | UUID | FK | Referência ao exercício |
| sets | Integer | - | Número de séries |
| reps | Integer | - | Número de repetições |
| weight | Decimal | - | Carga (kg) |
| restSeconds | Integer | - | Tempo de descanso (segundos) |
| notes | Text | - | Observações |
| order | Integer | - | Ordem no treino |

**Relacionamentos:**

- WorkoutExercise **N:1** Workout
- WorkoutExercise **N:1** Exercise

---

## 📊 CATEGORIA: AVALIAÇÃO FÍSICA

### 11. PhysicalEvaluation (Avaliação Física)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| studentId | UUID | FK | Referência ao aluno |
| evaluatorId | UUID | FK | Referência ao avaliador (User) |
| evaluationDate | Date | - | Data da avaliação |
| weight | Decimal | - | Peso (kg) |
| height | Decimal | - | Altura (cm) |
| bodyFat | Decimal | - | Percentual de gordura |
| muscleMass | Decimal | - | Massa muscular (kg) |
| imc | Decimal | - | IMC (calculado automaticamente) |
| notes | Text | - | Observações |
| measurements | JSON | - | Circunferências (braço, cintura, etc) |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- PhysicalEvaluation **N:1** Student
- PhysicalEvaluation **N:1** User (avaliador)

---

## ⚙️ CATEGORIA: EQUIPAMENTOS

### 12. Equipment (Equipamento)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| gymUnitId | UUID | FK | Referência à unidade |
| name | String | - | Nome do equipamento |
| code | String | UK | Código de identificação |
| description | Text | - | Descrição |
| status | Enum | - | operational, maintenance, broken |
| purchaseDate | Date | - | Data de compra |
| purchaseValue | Decimal | - | Valor de compra |
| lastMaintenanceDate | Date | - | Data da última manutenção |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- Equipment **N:1** GymUnit
- Equipment **1:N** MaintenanceLog

---

### 13. MaintenanceLog (Registro de Manutenção)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| equipmentId | UUID | FK | Referência ao equipamento |
| userId | UUID | FK | Quem registrou a manutenção |
| maintenanceDate | Date | - | Data da manutenção |
| description | Text | - | Descrição do serviço |
| cost | Decimal | - | Custo da manutenção |
| type | Enum | - | preventive, corrective |
| createdAt | DateTime | - | Data de criação |

**Relacionamentos:**

- MaintenanceLog **N:1** Equipment
- MaintenanceLog **N:1** User (registrador)

---

## 📦 CATEGORIA: ESTOQUE E VENDAS

### 14. Supplier (Fornecedor)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| gymUnitId | UUID | FK | Referência à unidade |
| name | String | - | Nome do fornecedor |
| cnpj | String | UK | CNPJ do fornecedor |
| email | String | - | Email de contato |
| phone | String | - | Telefone |
| address | String | - | Endereço |
| notes | Text | - | Observações |
| isActive | Boolean | - | Fornecedor ativo/inativo |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- Supplier **N:1** GymUnit
- Supplier **1:N** Product

---

### 15. Product (Produto)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| gymUnitId | UUID | FK | Referência à unidade |
| supplierId | UUID | FK | Referência ao fornecedor |
| name | String | - | Nome do produto |
| sku | String | UK | Código SKU |
| description | Text | - | Descrição |
| purchasePrice | Decimal | - | Preço de compra |
| salePrice | Decimal | - | Preço de venda |
| currentStock | Integer | - | Estoque atual |
| minStock | Integer | - | Estoque mínimo |
| category | Enum | - | supplement, equipment, clothing, accessory |
| isActive | Boolean | - | Produto ativo/inativo |
| createdAt | DateTime | - | Data de criação |
| updatedAt | DateTime | - | Data de atualização |

**Relacionamentos:**

- Product **N:1** GymUnit
- Product **N:1** Supplier
- Product **1:N** StockMovement
- Product **N:M** Sale (via SaleItem)

---

### 16. StockMovement (Movimentação de Estoque)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| productId | UUID | FK | Referência ao produto |
| userId | UUID | FK | Quem registrou a movimentação |
| type | Enum | - | in, out, adjustment |
| quantity | Integer | - | Quantidade movimentada |
| reason | Text | - | Motivo da movimentação |
| movementDate | DateTime | - | Data da movimentação |
| createdAt | DateTime | - | Data de criação |

**Relacionamentos:**

- StockMovement **N:1** Product
- StockMovement **N:1** User (registrador)

---

### 17. Sale (Venda)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| gymUnitId | UUID | FK | Referência à unidade |
| studentId | UUID | FK (null) | Referência ao aluno (opcional) |
| userId | UUID | FK | Referência ao vendedor |
| totalAmount | Decimal | - | Valor total da venda |
| paymentMethod | Enum | - | cash, credit, debit, pix |
| saleDate | DateTime | - | Data da venda |
| createdAt | DateTime | - | Data de criação |

**Relacionamentos:**

- Sale **N:1** GymUnit
- Sale **N:1** Student (opcional)
- Sale **N:1** User (vendedor)
- Sale **1:N** SaleItem

---

### 18. SaleItem (Item da Venda)

| Campo | Tipo | Constraint | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PK | Identificador único |
| saleId | UUID | FK | Referência à venda |
| productId | UUID | FK | Referência ao produto |
| quantity | Integer | - | Quantidade vendida |
| unitPrice | Decimal | - | Preço unitário no momento |
| subtotal | Decimal | - | Subtotal do item |

**Relacionamentos:**

- SaleItem **N:1** Sale
- SaleItem **N:1** Product

---

## 🔗 RESUMO DOS RELACIONAMENTOS PRINCIPAIS

### Multi-Tenancy (Isolamento por Unidade)

```
GymUnit (1) ──→ (N) User
GymUnit (1) ──→ (N) Student
GymUnit (1) ──→ (N) Plan
GymUnit (1) ──→ (N) Equipment
GymUnit (1) ──→ (N) Product
GymUnit (1) ──→ (N) Supplier
```

### Fluxo de Matrícula e Pagamentos

```
Student (1) ──→ (N) Enrollment
Plan (1) ──→ (N) Enrollment
Enrollment (1) ──→ (N) Financial
```

### Controle de Acesso

```
Student (1) ──→ (N) CheckIn
User (1) ──→ (N) CheckIn [registrador]
```

### Gestão de Treinos

```
Student (1) ──→ (N) Workout
User/Instructor (1) ──→ (N) Workout [criador]
Workout (N) ──→ (M) Exercise [via WorkoutExercise]
```

### Avaliação Física

```
Student (1) ──→ (N) PhysicalEvaluation
User/Instructor (1) ──→ (N) PhysicalEvaluation [avaliador]
```

### Equipamentos

```
Equipment (1) ──→ (N) MaintenanceLog
User (1) ──→ (N) MaintenanceLog [registrador]
```

### Estoque e Vendas

```
Supplier (1) ──→ (N) Product
Product (1) ──→ (N) StockMovement
Sale (1) ──→ (N) SaleItem
Product (N) ──→ (M) Sale [via SaleItem]
```

---

## Roadmap de Desenvolvimento

# 🏋️ ROADMAP DE DESENVOLVIMENTO - SISTEMA DE GERENCIAMENTO DE ACADEMIA

## 📊 LEGENDA DE STATUS

- ⏳ **PENDENTE**: Ainda não iniciado
- 🔄 **EM PROGRESSO**: Desenvolvimento em andamento
- ✅ **CONCLUÍDO**: Requisito finalizado e testado
- ⚠️ **BLOQUEADO**: Aguardando dependência
- ❌ **CANCELADO**: Requisito removido do escopo

---

## 📦 FASE 1: CONFIGURAÇÃO INICIAL DO BACKEND

### Módulo 1: Setup do Projeto e Infraestrutura Base

| ID | Requisito | Status |
|---|---|---|
| R1.1 | Inicializar projeto Node.js + TypeScript | ⏳ PENDENTE |
| R1.2 | Configurar ESLint + Prettier | ⏳ PENDENTE |
| R1.3 | Criar estrutura de pastas (MVC) | ⏳ PENDENTE |
| R1.4 | Configurar Docker (MySQL + Redis) | ⏳ PENDENTE |
| R1.5 | Setup de variáveis de ambiente (.env) | ⏳ PENDENTE |
| R1.6 | Configurar Sequelize ORM + Migrations | ⏳ PENDENTE |
| R1.7 | Criar script de inicialização do banco | ⏳ PENDENTE |

---

## 🏢 FASE 2: ENTIDADES CORE E MULTI-TENANCY

### Módulo 2: Gestão de Unidades (Multi-Tenant)

| ID | Requisito | Status |
|---|---|---|
| R2.1 | Criar Model GymUnit | ⏳ PENDENTE |
| R2.2 | Criar Migration GymUnit | ⏳ PENDENTE |
| R2.3 | Implementar Controller GymUnit (CRUD) | ⏳ PENDENTE |
| R2.4 | Criar Routes GymUnit | ⏳ PENDENTE |
| R2.5 | Criar Middleware de Tenant Isolation | ⏳ PENDENTE |
| R2.6 | Implementar Seeds para unidades de teste | ⏳ PENDENTE |

### Módulo 3: Gestão de Planos

| ID | Requisito | Status |
|---|---|---|
| R3.1 | Criar Model Plan | ⏳ PENDENTE |
| R3.2 | Criar Migration Plan | ⏳ PENDENTE |
| R3.3 | Implementar Controller Plan (CRUD) | ⏳ PENDENTE |
| R3.4 | Criar Routes Plan | ⏳ PENDENTE |
| R3.5 | Implementar validações de negócio | ⏳ PENDENTE |
| R3.6 | Implementar Seeds para planos básicos | ⏳ PENDENTE |

---

## 👥 FASE 3: GESTÃO DE USUÁRIOS E AUTENTICAÇÃO

### Módulo 4: Sistema de Autenticação (JWT)

| ID | Requisito | Status |
|---|---|---|
| R4.1 | Criar Model User | ⏳ PENDENTE |
| R4.2 | Criar Migration User | ⏳ PENDENTE |
| R4.3 | Implementar hash de senha (bcrypt) | ⏳ PENDENTE |
| R4.4 | Criar serviço de geração JWT | ⏳ PENDENTE |
| R4.5 | Implementar AuthController (login/logout) | ⏳ PENDENTE |
| R4.6 | Criar Middleware de Autenticação | ⏳ PENDENTE |
| R4.7 | Criar Middleware de Autorização (RBAC) | ⏳ PENDENTE |
| R4.8 | Implementar refresh token | ⏳ PENDENTE |
| R4.9 | Criar Seeds para usuários de teste | ⏳ PENDENTE |

### Módulo 5: Gestão de Alunos

| ID | Requisito | Status |
|---|---|---|
| R5.1 | Criar Model Student | ⏳ PENDENTE |
| R5.2 | Criar Migration Student | ⏳ PENDENTE |
| R5.3 | Implementar Controller Student (CRUD) | ⏳ PENDENTE |
| R5.4 | Criar Routes Student | ⏳ PENDENTE |
| R5.5 | Implementar upload de foto (Multer) | ⏳ PENDENTE |
| R5.6 | Implementar validações (CPF, Email único) | ⏳ PENDENTE |
| R5.7 | Criar Seeds para alunos de teste | ⏳ PENDENTE |

---

## 💰 FASE 4: GESTÃO FINANCEIRA E MATRÍCULAS

### Módulo 6: Matrículas e Pagamentos

| ID | Requisito | Status |
|---|---|---|
| R6.1 | Criar Model Enrollment | ⏳ PENDENTE |
| R6.2 | Criar Migration Enrollment | ⏳ PENDENTE |
| R6.3 | Implementar Controller Enrollment | ⏳ PENDENTE |
| R6.4 | Criar lógica de cálculo de vigência | ⏳ PENDENTE |
| R6.5 | Implementar controle de status (ativo/expirado) | ⏳ PENDENTE |
| R6.6 | Criar Model Payment | ⏳ PENDENTE |
| R6.7 | Criar Migration Payment | ⏳ PENDENTE |
| R6.8 | Implementar Controller Payment | ⏳ PENDENTE |
| R6.9 | Criar sistema de geração de cobranças | ⏳ PENDENTE |

### Módulo 7: Controle Financeiro

| ID | Requisito | Status |
|---|---|---|
| R7.1 | Criar Model Financial | ⏳ PENDENTE |
| R7.2 | Criar Migration Financial | ⏳ PENDENTE |
| R7.3 | Implementar Controller Financial (CRUD) | ⏳ PENDENTE |
| R7.4 | Criar relatório de inadimplência | ⏳ PENDENTE |
| R7.5 | Implementar dashboard financeiro | ⏳ PENDENTE |
| R7.6 | Criar filtros por período/categoria | ⏳ PENDENTE |

---

## 🏃 FASE 5: CONTROLE DE ACESSO E TREINOS

### Módulo 8: Check-in/Check-out

| ID | Requisito | Status |
|---|---|---|
| R8.1 | Criar Model CheckIn | ⏳ PENDENTE |
| R8.2 | Criar Migration CheckIn | ⏳ PENDENTE |
| R8.3 | Implementar Controller CheckIn | ⏳ PENDENTE |
| R8.4 | Validar matrícula ativa no check-in | ⏳ PENDENTE |
| R8.5 | Implementar limite de check-ins por plano | ⏳ PENDENTE |
| R8.6 | Criar relatório de frequência | ⏳ PENDENTE |

### Módulo 9: Treinos e Exercícios

| ID | Requisito | Status |
|---|---|---|
| R9.1 | Criar Model Exercise | ⏳ PENDENTE |
| R9.2 | Criar Migration Exercise | ⏳ PENDENTE |
| R9.3 | Implementar Controller Exercise (CRUD) | ⏳ PENDENTE |
| R9.4 | Criar biblioteca de exercícios padrão (Seeds) | ⏳ PENDENTE |
| R9.5 | Criar Model Workout | ⏳ PENDENTE |
| R9.6 | Criar Migration Workout | ⏳ PENDENTE |
| R9.7 | Criar Model WorkoutExercise | ⏳ PENDENTE |
| R9.8 | Criar Migration WorkoutExercise | ⏳ PENDENTE |
| R9.9 | Implementar Controller Workout | ⏳ PENDENTE |
| R9.10 | Criar sistema de atribuição de treinos | ⏳ PENDENTE |

---

## 📊 FASE 6: AVALIAÇÕES E EQUIPAMENTOS

### Módulo 10: Avaliação Física

| ID | Requisito | Status |
|---|---|---|
| R10.1 | Criar Model PhysicalEvaluation | ⏳ PENDENTE |
| R10.2 | Criar Migration PhysicalEvaluation | ⏳ PENDENTE |
| R10.3 | Implementar Controller PhysicalEvaluation | ⏳ PENDENTE |
| R10.4 | Criar cálculo automático de IMC | ⏳ PENDENTE |
| R10.5 | Implementar histórico de evolução | ⏳ PENDENTE |
| R10.6 | Criar gráficos de progresso | ⏳ PENDENTE |

### Módulo 11: Gestão de Equipamentos

| ID | Requisito | Status |
|---|---|---|
| R11.1 | Criar Model Equipment | ⏳ PENDENTE |
| R11.2 | Criar Migration Equipment | ⏳ PENDENTE |
| R11.3 | Implementar Controller Equipment (CRUD) | ⏳ PENDENTE |
| R11.4 | Criar Model MaintenanceLog | ⏳ PENDENTE |
| R11.5 | Criar Migration MaintenanceLog | ⏳ PENDENTE |
| R11.6 | Implementar Controller MaintenanceLog | ⏳ PENDENTE |
| R11.7 | Criar alertas de manuten

## Como Executar

[Instruções de instalação e execução]

## Tecnologias Utilizadas

- Node.js 18.x
- TypeScript
- Restful API
- MySQL
- Docker
- Sequelize
- React
- JWT

## ✅ CHECKLIST DE VALIDAÇÃO

- ✅ 18 entidades mapeadas
- ✅ Suporte a multi-tenancy (GymUnit)
- ✅ Todos os relacionamentos definidos
- ✅ Chaves primárias, estrangeiras e únicas identificadas
- ✅ Enums documentados
- ✅ Timestamps (createdAt/updatedAt) em todas as entidades
- ✅ Campos de soft delete quando necessário (isActive)

---

**Este documento está pronto para ser usado como referência durante todo o desenvolvimento!**
