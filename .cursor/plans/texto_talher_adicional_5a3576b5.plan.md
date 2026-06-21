---
name: Texto talher adicional
overview: Alterar a mensagem informativa do checkbox de talher no montador, de "O talher custa R$ 0,50 por unidade" para "Adicional de R$ 0,50".
todos:
  - id: update-copy
    content: Alterar texto informativo do talher em BowlBuilder.tsx (linha ~187)
    status: completed
isProject: false
---

# Trocar mensagem do talher para "Adicional de R$ 0,50"

## O que muda

Apenas o texto informativo abaixo do checkbox "Deseja talher?" em [`src/components/BowlBuilder.tsx`](src/components/BowlBuilder.tsx).

**Antes (linhas 186–188):**

```tsx
<p className="mt-1 text-sm text-zinc-500">
  O talher custa {brl.format(CUTLERY_PRICE)} por unidade.
</p>
```

**Depois:**

```tsx
<p className="mt-1 text-sm text-zinc-500">
  Adicional de {brl.format(CUTLERY_PRICE)}.
</p>
```

O valor continua vindo de `CUTLERY_PRICE` via `brl.format`, então se o preço mudar no futuro o texto acompanha automaticamente.

## O que não muda

- Lógica de preço (`CUTLERY_PRICE`, `unitPrice`, `lineTotal`)
- Badge âmbar quando marcado: `Talher: +R$ X,XX`
- Texto no carrinho: `Com talher (+R$ X,XX)` em [`src/components/OrderCart.tsx`](src/components/OrderCart.tsx)
- Linha no WhatsApp: `• Talher (+R$ X,XX)` em [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts)

Esses outros textos já usam o formato de acréscimo (`+R$`) e não mencionam "por unidade".

## Verificação

Abrir o montador, localizar a seção "Deseja talher?" e confirmar que o subtítulo exibe **"Adicional de R$ 0,50."** (ou o valor atual de `CUTLERY_PRICE`).
