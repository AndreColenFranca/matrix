---
task: list-products
agent: product-manager
squad: sales-squad
version: 1.0.0
elicit: false
---

# List Products

## Purpose

Listar produtos do catálogo com suporte a filtros e ordenação.

## Parameters

| Parameter  | Type   | Required | Default | Description                              |
| ---------- | ------ | -------- | ------- | ---------------------------------------- |
| `category` | string | false    | -       | Filtrar por categoria                    |
| `filter`   | object | false    | {}      | Filtros adicionais (preço, tamanho, etc) |
| `sort`     | string | false    | "name"  | Campo de ordenação                       |
| `limit`    | number | false    | 20      | Quantidade de resultados                 |
| `offset`   | number | false    | 0       | Offset para paginação                    |

## Returns

```json
{
  "products": [
    {
      "id": "prod_123",
      "name": "Aliança Ouro 18K",
      "description": "Aliança de ouro 18 quilates",
      "price": 1500,
      "category": "alianças",
      "images": ["url1", "url2"],
      "specs": {
        "material": "Ouro 18K",
        "weight": "5g"
      }
    }
  ],
  "total_count": 150,
  "limit": 20,
  "offset": 0
}
```

## Example Usage

```bash
*sales list-products category="alianças" sort="price" limit=10
```

## Checklist

- [ ] Validar parâmetros de entrada
- [ ] Conectar com database
- [ ] Aplicar filtros
- [ ] Aplicar ordenação
- [ ] Paginar resultados
- [ ] Formatar resposta
- [ ] Cachear resultado (se aplicável)
