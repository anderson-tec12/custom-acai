import menu from "../menu.json"

export const menuConfig = menu

const sizeById = new Map(menu.sizes.map((s) => [s.id, s]))
const productById = new Map(menu.standaloneProducts.map((p) => [p.id, p]))
const paymentById = new Map(menu.paymentMethods.map((p) => [p.id, p]))
const deliveryById = new Map(menu.deliveryTypes.map((d) => [d.id, d]))

const toppingById = new Map(
  menu.toppingCategories.flatMap((c) => c.toppings.map((t) => [t.id, { ...t, category: c.name }] as const))
)

export const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function getSize(id: string) {
  return sizeById.get(id)
}

export function getTopping(id: string) {
  return toppingById.get(id)
}

export function getProduct(id: string) {
  return productById.get(id)
}

export function getPayment(id: string) {
  return paymentById.get(id)
}

export function getDelivery(id: string) {
  return deliveryById.get(id)
}

export function calcBowlUnitPrice(toppingIds: string[]): number {
  const extraCount = Math.max(0, toppingIds.length - menu.freeToppingsPerBowl)
  return extraCount * menu.extraToppingPrice
}

export function calcBowlLineTotal(sizeId: string, toppingIds: string[], quantity: number): number {
  const size = getSize(sizeId)
  if (!size) return 0
  const unit = size.price + calcBowlUnitPrice(toppingIds)
  return unit * quantity
}

export function calcProductLineTotal(productId: string, quantity: number): number {
  const product = getProduct(productId)
  if (!product) return 0
  return product.price * quantity
}
