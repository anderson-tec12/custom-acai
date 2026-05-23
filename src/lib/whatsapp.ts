import { menuConfig } from "./menu"
import {
  brl,
  calcBowlLineTotal,
  calcBowlUnitPrice,
  calcProductLineTotal,
  getDelivery,
  getPayment,
  getProduct,
  getSize,
  getTopping,
} from "./menu"
import type { OrderState } from "../types"

export function buildWhatsappMessage(order: OrderState, storeName: string): string {
  const lines: string[] = [
    `🥤 *NOVO PEDIDO — ${storeName}*`,
    "",
    `👤 *Cliente:* ${order.customer.name}`,
    `📱 *Telefone:* ${order.customer.phone}`,
    `📦 *Tipo:* ${getDelivery(order.customer.deliveryType)?.name ?? order.customer.deliveryType}`,
  ]

  if (order.customer.deliveryType === "entrega" && order.customer.address.trim()) {
    lines.push(`📍 *Endereço:* ${order.customer.address.trim()}`)
  }

  if (order.customer.notes.trim()) {
    lines.push(`📝 *Obs. cliente:* ${order.customer.notes.trim()}`)
  }

  lines.push("", "*Itens do pedido:*")

  let itemIndex = 0
  for (const bowl of order.bowls) {
    const size = getSize(bowl.sizeId)
    const sizeName = size?.name ?? bowl.sizeId
    const unitExtras = calcBowlUnitPrice(bowl.toppingIds)
    const lineTotal = calcBowlLineTotal(bowl.sizeId, bowl.toppingIds, bowl.quantity)
    itemIndex += 1

    lines.push("")
    lines.push(`${itemIndex}. *${bowl.quantity}x Açaí ${sizeName}* — ${brl.format(lineTotal)}`)

    if (bowl.toppingIds.length > 0) {
      const freeLimit = menuConfig.freeToppingsPerBowl
      const toppingLines = bowl.toppingIds.map((id, idx) => {
        const name = getTopping(id)?.name ?? id
        const isExtra = idx >= freeLimit
        return isExtra ? `   + ${name} (extra)` : `   • ${name}`
      })
      lines.push(...toppingLines)
    } else {
      lines.push("   • Sem complementos")
    }

    if (unitExtras > 0) {
      lines.push(`   _Complementos extras: ${brl.format(unitExtras)} por unidade_`)
    }

    if (bowl.notes.trim()) {
      lines.push(`   _Obs.: ${bowl.notes.trim()}_`)
    }
  }

  for (const line of order.products) {
    const product = getProduct(line.productId)
    const name = product?.name ?? line.productId
    const lineTotal = calcProductLineTotal(line.productId, line.quantity)
    itemIndex += 1
    lines.push("")
    lines.push(`${itemIndex}. *${line.quantity}x ${name}* — ${brl.format(lineTotal)}`)
  }

  const payment = getPayment(order.paymentId)
  const total = calcOrderTotal(order)

  lines.push("")
  lines.push("─────────────────")
  lines.push(`💳 *Pagamento:* ${payment?.name ?? "Não informado"}`)
  lines.push(`💰 *TOTAL: ${brl.format(total)}*`)

  return lines.join("\n")
}

export function calcOrderTotal(order: OrderState): number {
  const bowlsTotal = order.bowls.reduce(
    (sum, b) => sum + calcBowlLineTotal(b.sizeId, b.toppingIds, b.quantity),
    0
  )
  const productsTotal = order.products.reduce(
    (sum, p) => sum + calcProductLineTotal(p.productId, p.quantity),
    0
  )
  return bowlsTotal + productsTotal
}

export function openWhatsappOrder(message: string, phoneE164: string) {
  const url = `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`
  window.open(url, "_blank", "noopener,noreferrer")
}
