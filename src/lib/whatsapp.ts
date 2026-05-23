import {
  brl,
  calcAccompanimentsPrice,
  calcBowlLineTotal,
  calcExtraFruitsPrice,
  describeBowlToppings,
  getPayment,
  getSize,
} from "./menu"
import type { OrderState } from "../types"

export function buildWhatsappMessage(order: OrderState, storeName: string): string {
  const lines: string[] = [`*NOVO PEDIDO — ${storeName}*`, "", "*Itens do pedido:*"]

  for (const bowl of order.bowls) {
    const size = getSize(bowl.sizeId)
    const sizeName = size?.name ?? bowl.sizeId
    const extraFruitsPrice = calcExtraFruitsPrice(bowl.toppingIds)
    const accompanimentsPrice = calcAccompanimentsPrice(bowl.toppingIds)
    const lineTotal = calcBowlLineTotal(bowl.sizeId, bowl.toppingIds, bowl.quantity)
    const { fruits, extraFruits, accompaniments } = describeBowlToppings(bowl.toppingIds)

    lines.push("")
    lines.push(`*${bowl.quantity}x Açaí ${sizeName}* — ${brl.format(lineTotal)}`)

    if (fruits.length > 0) {
      for (const fruit of fruits) {
        lines.push(`   • ${fruit.name}`)
      }
    }

    if (extraFruits.length > 0) {
      for (const fruit of extraFruits) {
        const price = fruit.price != null ? ` (+${brl.format(fruit.price)})` : ""
        lines.push(`   + ${fruit.name}${price}`)
      }
    }

    if (accompaniments.length > 0) {
      for (const topping of accompaniments) {
        const price = topping.price != null ? ` (+${brl.format(topping.price)})` : ""
        lines.push(`   • ${topping.name}${price}`)
      }
    }

    if (fruits.length === 0 && extraFruits.length === 0 && accompaniments.length === 0) {
      lines.push("   • Sem complementos")
    }

    if (extraFruitsPrice > 0) {
      lines.push(`   _Frutas extras: ${brl.format(extraFruitsPrice)}_`)
    }
    if (accompanimentsPrice > 0) {
      lines.push(`   _Complementos: ${brl.format(accompanimentsPrice)}_`)
    }

    if (bowl.notes.trim()) {
      lines.push(`   _Obs.: ${bowl.notes.trim()}_`)
    }
  }

  const payment = getPayment(order.paymentId)
  const total = calcOrderTotal(order)

  lines.push("")
  lines.push("─────────────────")
  lines.push(`*Pagamento:* ${payment?.name ?? "Não informado"}`)
  lines.push(`*TOTAL: ${brl.format(total)}*`)

  return lines.join("\n")
}

export function calcOrderTotal(order: OrderState): number {
  return order.bowls.reduce(
    (sum, b) => sum + calcBowlLineTotal(b.sizeId, b.toppingIds, b.quantity),
    0
  )
}

export function openWhatsappOrder(message: string, phoneE164: string) {
  const url = `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`
  window.open(url, "_blank", "noopener,noreferrer")
}
