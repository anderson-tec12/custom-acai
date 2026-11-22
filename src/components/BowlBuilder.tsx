import { useMemo, useState } from "react"
import menu from "../menu.json"
import {
  brl,
  calcAccompanimentsPrice,
  calcBowlLineTotal,
  calcBowlUnitPrice,
  calcExtraAccompanimentsPrice,
  calcExtraFruitsPrice,
  countToppingsInCategory,
  CUTLERY_PRICE,
  filterAllowedToppings,
  getCategoryMaxSelect,
  getSizeKind,
  getSizesByKind,
  getTopping,
  isCategoryDisabledForSize,
  isCategoryIncludedInSize,
  isToppingExcludedForSize,
  type SizeKind,
} from "../lib/menu"
import type { SizeId } from "../types"

type BowlBuilderProps = {
  onAdd: (bowl: {
    sizeId: SizeId
    toppingIds: string[]
    notes: string
    quantity: number
    wantsCutlery: boolean
  }) => void
}

function getSubtitle(sizeId: SizeId): string | null {
  if (sizeId === "casquinha") return null
  if (getSizeKind(sizeId) === "marmita") {
    return "Até 2 frutas e 2 acompanhamentos inclusos. KitKat, Nutella e creme de Ninho são cobrados à parte."
  }
  const maxFruits = getCategoryMaxSelect(sizeId, "frutas")
  if (maxFruits === 1) return "Até 1 fruta inclusa no copo"
  return "Até 2 frutas inclusas no copo"
}

export function BowlBuilder({ onAdd }: BowlBuilderProps) {
  const [sizeKind, setSizeKind] = useState<SizeKind>("copo")
  const [sizeId, setSizeId] = useState<SizeId>("300")
  const [toppingIds, setToppingIds] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [wantsCutlery, setWantsCutlery] = useState(false)

  const sizesForKind = useMemo(() => getSizesByKind(sizeKind), [sizeKind])

  const unitPrice = useMemo(() => {
    const size = menu.sizes.find((s) => s.id === sizeId)
    if (!size) return 0
    const base = size.price + calcBowlUnitPrice(sizeId, toppingIds)
    return wantsCutlery ? base + CUTLERY_PRICE : base
  }, [sizeId, toppingIds, wantsCutlery])

  const lineTotal = useMemo(
    () => calcBowlLineTotal(sizeId, toppingIds, quantity, wantsCutlery),
    [sizeId, toppingIds, quantity, wantsCutlery]
  )

  const extraFruitsPrice = useMemo(() => calcExtraFruitsPrice(toppingIds), [toppingIds])
  const extraAccompanimentsPrice = useMemo(
    () => calcExtraAccompanimentsPrice(toppingIds),
    [toppingIds]
  )
  const accompanimentsPrice = useMemo(
    () => calcAccompanimentsPrice(sizeId, toppingIds),
    [sizeId, toppingIds]
  )
  const isCasquinha = sizeId === "casquinha"
  const subtitle = getSubtitle(sizeId)

  function handleKindChange(nextKind: SizeKind) {
    setSizeKind(nextKind)
    const nextSizes = getSizesByKind(nextKind)
    const currentInList = nextSizes.some((s) => s.id === sizeId)
    if (!currentInList && nextSizes.length > 0) {
      const nextSizeId = nextSizes[0].id as SizeId
      setSizeId(nextSizeId)
      setToppingIds((prev) => filterAllowedToppings(nextSizeId, prev))
    }
  }

  function handleSizeChange(nextSizeId: SizeId) {
    setSizeId(nextSizeId)
    setToppingIds((prev) => filterAllowedToppings(nextSizeId, prev))
  }

  function toggleTopping(id: string) {
    const topping = getTopping(id)
    if (!topping) return

    if (isCategoryDisabledForSize(sizeId, topping.categoryId)) return
    if (isToppingExcludedForSize(sizeId, id)) return

    setToppingIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((t) => t !== id)
      }

      const maxSelect = getCategoryMaxSelect(sizeId, topping.categoryId)
      if (
        maxSelect != null &&
        countToppingsInCategory(prev, topping.categoryId) >= maxSelect
      ) {
        return prev
      }

      return [...prev, id]
    })
  }

  function handleAdd() {
    onAdd({ sizeId, toppingIds, notes, quantity, wantsCutlery })
    setToppingIds([])
    setNotes("")
    setQuantity(1)
    setWantsCutlery(false)
  }

  return (
    <section className="card">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-acai-900">Monte seu açaí</h2>
          {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
        </div>
        <span className="rounded-full bg-acai-100 px-3 py-1 text-sm font-semibold text-acai-800">
          {brl.format(lineTotal)}
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <p className="label">Tipo</p>
          <div className="mb-3 grid grid-cols-2 gap-2">
            {(["copo", "marmita"] as const).map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => handleKindChange(kind)}
                className={`rounded-xl border p-3 text-center font-semibold transition ${
                  sizeKind === kind
                    ? "border-acai-600 bg-acai-600 text-white shadow-md"
                    : "border-acai-200 bg-white hover:border-acai-400"
                }`}
              >
                {kind === "copo" ? "Copos" : "Marmitas"}
              </button>
            ))}
          </div>

          <p className="label">Tamanho</p>
          <div className="grid grid-cols-2 gap-2">
            {sizesForKind.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => handleSizeChange(size.id as SizeId)}
                className={`rounded-xl border p-3 text-center transition ${
                  sizeId === size.id
                    ? "border-acai-600 bg-acai-600 text-white shadow-md"
                    : "border-acai-200 bg-white hover:border-acai-400"
                }`}
              >
                <div className="font-semibold">{size.name}</div>
                <div className="text-xs opacity-90">{brl.format(size.price)}</div>
              </button>
            ))}
          </div>
          {sizeKind !== "marmita" && (
            <p className="mt-2 text-sm text-zinc-500">
              {isCasquinha
                ? "Acompanha leite em pó e leite condensado."
                : "Todos os tamanhos acompanham leite em pó e leite condensado."}
            </p>
          )}
        </div>

        {isCasquinha && (
          <p className="rounded-xl bg-acai-50 px-3 py-2 text-sm text-acai-800">
            Açaí na casquinha acompanha leite em pó e leite condensado. Adicionais opcionais abaixo.
          </p>
        )}

        {menu.toppingCategories
          .filter((category) => !isCategoryDisabledForSize(sizeId, category.id))
          .map((category) => {
            const categoryCount = countToppingsInCategory(toppingIds, category.id)
            const maxSelect = getCategoryMaxSelect(sizeId, category.id)
            const categoryIncluded = isCategoryIncludedInSize(sizeId, category.id)

            return (
              <div key={category.id}>
                <p className="label">
                  {category.name}
                  {maxSelect != null && (
                    <span className="ml-1 font-normal text-zinc-400">
                      ({categoryCount}/{maxSelect})
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.toppings
                    .filter((topping) => !isToppingExcludedForSize(sizeId, topping.id))
                    .map((topping) => {
                      const selected = toppingIds.includes(topping.id)
                      const atMax =
                        maxSelect != null && !selected && categoryCount >= maxSelect
                      const price =
                        "price" in topping && typeof topping.price === "number"
                          ? topping.price
                          : undefined
                      const showPrice = price != null && !categoryIncluded
                      const label = showPrice
                        ? `${topping.name} +${brl.format(price)}`
                        : topping.name

                      return (
                        <button
                          key={topping.id}
                          type="button"
                          disabled={atMax}
                          onClick={() => toggleTopping(topping.id)}
                          className={`chip ${
                            selected
                              ? "chip-selected"
                              : atMax
                                ? "cursor-not-allowed opacity-40"
                                : "hover:border-acai-400"
                          }`}
                        >
                          {label}
                        </button>
                      )
                    })}
                </div>
              </div>
            )
          })}

        {extraFruitsPrice > 0 && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Frutas extras: +{brl.format(extraFruitsPrice)}
          </p>
        )}

        {accompanimentsPrice > 0 && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Complementos: +{brl.format(accompanimentsPrice)}
          </p>
        )}

        {extraAccompanimentsPrice > 0 && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Acompanhamentos extras: +{brl.format(extraAccompanimentsPrice)}
          </p>
        )}

        <div>
          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-acai-300 accent-acai-600"
              checked={wantsCutlery}
              onChange={(e) => setWantsCutlery(e.target.checked)}
            />
            <span className="text-sm font-medium text-zinc-700">Deseja talher?</span>
          </label>
          <p className="mt-1 text-sm text-zinc-500">
            Adicional de {brl.format(CUTLERY_PRICE)}.
          </p>
        </div>

        {wantsCutlery && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Talher: +{brl.format(CUTLERY_PRICE * quantity)}
          </p>
        )}

        <div>
          <label className="label" htmlFor="bowl-notes">
            Observações deste item
          </label>
          <textarea
            id="bowl-notes"
            className="input min-h-20 resize-y"
            placeholder=""
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-700">Quantidade</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-secondary h-9 w-9 rounded-full p-0"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
              >
                −
              </button>
              <span className="min-w-8 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                className="btn-secondary h-9 w-9 rounded-full p-0"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>
            <span className="text-sm text-zinc-500">{brl.format(unitPrice)} / un.</span>
          </div>

          <button type="button" className="btn-primary w-full sm:w-auto" onClick={handleAdd}>
            Adicionar ao pedido
          </button>
        </div>
      </div>
    </section>
  )
}
