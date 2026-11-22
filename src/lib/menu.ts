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

export type SizeKind = "copo" | "marmita"

export function getSize(id: string) {
  return sizeById.get(id)
}

export function getSizeKind(sizeId: string): SizeKind {
  const size = getSize(sizeId)
  if (size && "kind" in size && size.kind === "marmita") return "marmita"
  return "copo"
}

export function getSizesByKind(kind: SizeKind) {
  return menu.sizes.filter((size) => {
    const sizeKind = "kind" in size && size.kind === "marmita" ? "marmita" : "copo"
    return sizeKind === kind
  })
}

export function getIncludedCategories(sizeId: string): string[] {
  const size = getSize(sizeId)
  if (!size || !("includedCategories" in size)) return []
  const included = size.includedCategories
  return Array.isArray(included) ? included : []
}

export function isCategoryIncludedInSize(sizeId: string, categoryId: string): boolean {
  return getIncludedCategories(sizeId).includes(categoryId)
}

export function getExcludedToppingIds(sizeId: string): string[] {
  const size = getSize(sizeId)
  if (!size || !("excludedToppingIds" in size)) return []
  const excluded = size.excludedToppingIds
  return Array.isArray(excluded) ? excluded : []
}

export function isToppingExcludedForSize(sizeId: string, toppingId: string): boolean {
  return getExcludedToppingIds(sizeId).includes(toppingId)
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
  const excluded = new Set(getExcludedToppingIds(sizeId))
  const allowed = toppingIds.filter((id) => {
    const topping = getTopping(id)
    return topping && !disabled.has(topping.categoryId) && !excluded.has(id)
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

export function calcExtraAccompanimentsPrice(toppingIds: string[]): number {
  return getToppingsByCategory(toppingIds, "acompanhamentos-extras").reduce(
    (sum, t) => sum + (t.price ?? 0),
    0
  )
}

export function calcAccompanimentsPrice(sizeId: string, toppingIds: string[]): number {
  const accompaniments = getToppingsByCategory(toppingIds, "acompanhamentos")
  const categoryIncluded = isCategoryIncludedInSize(sizeId, "acompanhamentos")

  return accompaniments.reduce((sum, t) => {
    if (categoryIncluded && !isToppingExcludedForSize(sizeId, t.id)) return sum
    return sum + (t.price ?? 0)
  }, 0)
}

export function isAccompanimentCharged(sizeId: string, toppingId: string): boolean {
  const topping = getTopping(toppingId)
  if (!topping || topping.categoryId !== "acompanhamentos") return false
  if (isToppingExcludedForSize(sizeId, toppingId)) return true
  return !isCategoryIncludedInSize(sizeId, "acompanhamentos")
}

export function calcBowlUnitPrice(sizeId: string, toppingIds: string[]): number {
  return (
    calcExtraFruitsPrice(toppingIds) +
    calcAccompanimentsPrice(sizeId, toppingIds) +
    calcExtraAccompanimentsPrice(toppingIds)
  )
}

export function calcBowlLineTotal(
  sizeId: string,
  toppingIds: string[],
  quantity: number,
  wantsCutlery = false
): number {
  const size = getSize(sizeId)
  if (!size) return 0
  const unit = size.price + calcBowlUnitPrice(sizeId, toppingIds)
  const cutlery = wantsCutlery ? CUTLERY_PRICE * quantity : 0
  return unit * quantity + cutlery
}

export function describeBowlToppings(toppingIds: string[]): {
  fruits: ToppingEntry[]
  extraFruits: ToppingEntry[]
  accompaniments: ToppingEntry[]
  extraAccompaniments: ToppingEntry[]
} {
  return {
    fruits: getToppingsByCategory(toppingIds, "frutas"),
    extraFruits: getToppingsByCategory(toppingIds, "frutas-extras"),
    accompaniments: getToppingsByCategory(toppingIds, "acompanhamentos"),
    extraAccompaniments: getToppingsByCategory(toppingIds, "acompanhamentos-extras"),
  }
}
