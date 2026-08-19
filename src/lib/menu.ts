import menu from "../menu.json"

export const menuConfig = menu

const sizeById = new Map(menu.sizes.map((s) => [s.id, s]))
const paymentById = new Map(menu.paymentMethods.map((p) => [p.id, p]))

export type ToppingEntry = {
  id: string
  name: string
  price?: number
  categoryId: string
  categoryName: string
}

const categoryById = new Map(menu.toppingCategories.map((c) => [c.id, c]))

const toppingById = new Map<string, ToppingEntry>(
  menu.toppingCategories.flatMap((c) =>
    c.toppings.map(
      (t) =>
        [
          t.id,
          {
            ...t,
            categoryId: c.id,
            categoryName: c.name,
          },
        ] as const
    )
  )
)

export const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export const CUTLERY_PRICE = 0.5

export const CASQUINHA_DEFAULT_TOPPINGS = "Leite em pó e leite condensado"

export function getSize(id: string) {
  return sizeById.get(id)
}

export function getDisabledCategories(sizeId: string): string[] {
  const size = getSize(sizeId)
  if (!size || !("disabledCategories" in size)) return []
  const disabled = size.disabledCategories
  return Array.isArray(disabled) ? disabled : []
}

export function isCategoryDisabledForSize(sizeId: string, categoryId: string): boolean {
  return getDisabledCategories(sizeId).includes(categoryId)
}

export function getCategoryMaxSelect(sizeId: string, categoryId: string): number | undefined {
  const size = getSize(sizeId)
  if (size && "categoryMaxSelect" in size) {
    const overrides = size.categoryMaxSelect
    if (overrides && typeof overrides === "object" && categoryId in overrides) {
      const value = overrides[categoryId as keyof typeof overrides]
      if (typeof value === "number") return value
    }
  }

  const category = categoryById.get(categoryId)
  if (category && "maxSelect" in category) {
    const value = category.maxSelect
    return typeof value === "number" ? value : undefined
  }

  return undefined
}

export function filterAllowedToppings(sizeId: string, toppingIds: string[]): string[] {
  const disabled = new Set(getDisabledCategories(sizeId))
  const allowed = toppingIds.filter((id) => {
    const topping = getTopping(id)
    return topping && !disabled.has(topping.categoryId)
  })

  const counts = new Map<string, number>()
  return allowed.filter((id) => {
    const topping = getTopping(id)
    if (!topping) return false
    const maxSelect = getCategoryMaxSelect(sizeId, topping.categoryId)
    if (maxSelect == null) return true
    const count = counts.get(topping.categoryId) ?? 0
    if (count >= maxSelect) return false
    counts.set(topping.categoryId, count + 1)
    return true
  })
}

export function getTopping(id: string) {
  return toppingById.get(id)
}

export function getToppingCategory(id: string) {
  const topping = getTopping(id)
  if (!topping) return undefined
  return categoryById.get(topping.categoryId)
}

export function getPayment(id: string) {
  return paymentById.get(id)
}

export function countToppingsInCategory(toppingIds: string[], categoryId: string): number {
  return toppingIds.filter((id) => getTopping(id)?.categoryId === categoryId).length
}

export function getToppingsByCategory(toppingIds: string[], categoryId: string): ToppingEntry[] {
  return toppingIds
    .map((id) => getTopping(id))
    .filter((t): t is ToppingEntry => t !== undefined && t.categoryId === categoryId)
}

export function calcExtraFruitsPrice(toppingIds: string[]): number {
  return getToppingsByCategory(toppingIds, "frutas-extras").reduce((sum, t) => sum + (t.price ?? 0), 0)
}

export function calcAccompanimentsPrice(toppingIds: string[]): number {
  return getToppingsByCategory(toppingIds, "acompanhamentos").reduce(
    (sum, t) => sum + (t.price ?? 0),
    0
  )
}

export function calcBowlUnitPrice(toppingIds: string[]): number {
  return calcExtraFruitsPrice(toppingIds) + calcAccompanimentsPrice(toppingIds)
}

export function calcBowlLineTotal(
  sizeId: string,
  toppingIds: string[],
  quantity: number,
  wantsCutlery = false
): number {
  const size = getSize(sizeId)
  if (!size) return 0
  const unit = size.price + calcBowlUnitPrice(toppingIds)
  const cutlery = wantsCutlery ? CUTLERY_PRICE * quantity : 0
  return unit * quantity + cutlery
}

export function describeBowlToppings(toppingIds: string[]): {
  fruits: ToppingEntry[]
  extraFruits: ToppingEntry[]
  accompaniments: ToppingEntry[]
} {
  return {
    fruits: getToppingsByCategory(toppingIds, "frutas"),
    extraFruits: getToppingsByCategory(toppingIds, "frutas-extras"),
    accompaniments: getToppingsByCategory(toppingIds, "acompanhamentos"),
  }
}
