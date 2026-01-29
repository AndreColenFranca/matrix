---
task: create-product
agent: product-manager
squad: sales-squad
version: 1.0.0
elicit: true
---

# Create Product

Criar novo produto no catálogo.

## Entrada

- name: Nome do produto
- description: Descrição detalhada
- price: Preço
- category: Categoria
- images: Lista de URLs de imagens
- specs: Especificações (material, tamanho, peso, etc)

## Saida

- product_id: ID do novo produto
- status: Status da criação (success, error)
- message: Mensagem descritiva
