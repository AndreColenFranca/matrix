# Sales Squad 🛍️

**Squad para gerenciar página de vendas de alianças**

Domínio: E-commerce / Vendas de Joias

## 🎯 Propósito

O Sales Squad é responsável por orquestrar todas as operações de venda e transação de uma plataforma de e-commerce de alianças. Inclui:

- ✅ Gerenciamento de catálogo de produtos
- ✅ Processamento de carrinho de compras
- ✅ Processamento de checkout
- ✅ Validação e processamento de pagamentos
- ✅ Gerenciamento de promoções e descontos
- ✅ Processamento de reembolsos

## 👥 Agentes

### 1. **product-manager**

Gerencia o catálogo de produtos, preços e promoções.

**Responsabilidades:**

- Listar produtos com filtros
- Criar novos produtos
- Atualizar informações de produtos
- Gerenciar promoções e descontos

**Comandos:**

- `*sales list-products`
- `*sales create-product`
- `*sales update-product`
- `*sales manage-promotions`

---

### 2. **sales-agent**

Gerencia o processo de venda, carrinho e checkout.

**Responsabilidades:**

- Gerenciar carrinho de compras
- Aplicar códigos de desconto
- Processar checkout
- Criar pedidos confirmados

**Comandos:**

- `*sales manage-cart`
- `*sales apply-discount`
- `*sales process-checkout`
- `*sales create-order`

---

### 3. **payment-processor**

Processa pagamentos e validações.

**Responsabilidades:**

- Validar dados de cartão
- Processar pagamentos
- Confirmar transações
- Processar reembolsos

**Comandos:**

- `*sales validate-card`
- `*sales process-payment`
- `*sales confirm-transaction`
- `*sales handle-refund`

## 📋 Tarefas (12 total)

### Product Manager Tasks (4)

- `list-products` - Listar produtos com filtros
- `create-product` - Criar novo produto
- `update-product` - Atualizar produto
- `manage-promotions` - Gerenciar promoções

### Sales Agent Tasks (4)

- `manage-cart` - Gerenciar carrinho
- `apply-discount` - Aplicar cupom
- `process-checkout` - Processar checkout
- `create-order` - Criar pedido

### Payment Processor Tasks (4)

- `validate-card` - Validar cartão
- `process-payment` - Processar pagamento
- `confirm-transaction` - Confirmar transação
- `handle-refund` - Processar reembolso

## 🏗️ Estrutura

```
squads/sales-squad/
├── squad.yaml                          # Manifest do squad
├── README.md                           # Este arquivo
├── config/
│   ├── coding-standards.md            # Padrões de código
│   ├── tech-stack.md                  # Stack tecnológico
│   └── source-tree.md                 # Estrutura de código
├── agents/                            # Definições de agentes
│   ├── product-manager.md
│   ├── sales-agent.md
│   └── payment-processor.md
├── tasks/                             # Definições de tarefas
│   └── [12 task files]
├── workflows/                         # Fluxos multi-step
├── checklists/                        # Checklists de validação
├── templates/                         # Templates de documentos
├── tools/                             # Ferramentas customizadas
├── scripts/                           # Scripts utilitários
└── data/                              # Dados estáticos
```

## 🚀 Como Usar

### 1. Usar um agente do squad

```bash
# Listar produtos
*sales list-products category="alianças" sort="price"

# Criar novo produto
*sales create-product name="Aliança Ouro 18K" price=1500
```

### 2. Workflows (múltiplas tarefas)

```bash
# Fluxo completo de venda
1. Cliente adiciona produto ao carrinho
2. Aplica código de desconto
3. Processa checkout com endereço
4. Valida cartão
5. Processa pagamento
6. Confirma transação
7. Cria pedido final
```

## 📊 Confidence Score

- **Overall:** 89%
- **product-manager:** 94%
- **sales-agent:** 91%
- **payment-processor:** 88%

## 🔗 Integrações

Este squad é projetado para integrar com:

- **Stripe** - Processamento de pagamentos
- **Email Service** - Confirmações e notificações
- **Database** - Produtos, pedidos, clientes
- **Shipping API** - Rastreamento de entregas

## 📝 Próximos Passos

1. **Implementar agentes** - Use `@dev` para codificar os agentes
2. **Criar tarefas** - Defina as tasks específicas
3. **Configurar workflows** - Defina fluxos de múltiplas tarefas
4. **Testes** - Use `@qa` para validar
5. **Publicar** - Quando pronto, publique com `@devops *publish-squad`

## 📄 Licença

MIT License - Veja arquivo LICENSE para detalhes

---

**Criado:** 2026-01-28
**Versão:** 1.0.0
**Autor:** andre
