import { useMemo, useState } from "react"
import menu from "../menu.json"
import {
  brl,
  calcAccompanimentsPrice,
  calcBowlLineTotal,
  calcBowlUnitPrice,
  calcExtraFruitsPrice,
  countToppingsInCategory,
  CUTLERY_PRICE,
  filterAllowedToppings,
  getSize,
  getTopping,
  isCategoryDisabledForSize,
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

export function BowlBuilder({ onAdd }: BowlBuilderProps) {
  const [sizeId, setSizeId] = useState<SizeId>("300")
  const [toppingIds, setToppingIds] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [wantsCutlery, setWantsCutlery] = useState(false)

  const unitPrice = useMemo(() => {
    const size = getSize(sizeId)
    if (!size) return 0
    const base = size.price + calcBowlUnitPrice(toppingIds)
    return wantsCutlery ? base + CUTLERY_PRICE : base
  }, [sizeId, toppingIds, wantsCutlery])

  const lineTotal = useMemo(
    () => calcBowlLineTotal(sizeId, toppingIds, quantity, wantsCutlery),
    [sizeId, toppingIds, quantity, wantsCutlery]
  )

  const extraFruitsPrice = useMemo(() => calcExtraFruitsPrice(toppingIds), [toppingIds])
  const accompanimentsPrice = useMemo(() => calcAccompanimentsPrice(toppingIds), [toppingIds])
  const isCasquinha = sizeId === "casquinha"

  function handleSizeChange(nextSizeId: SizeId) {
    setSizeId(nextSizeId)
    setToppingIds((prev) => filterAllowedToppings(nextSizeId, prev))
  }

  function toggleTopping(id: string) {
    const topping = getTopping(id)
    if (!topping) return

    if (isCategoryDisabledForSize(sizeId, topping.categoryId)) return

    setToppingIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((t) => t !== id)
      }

      if (topping.categoryId === "frutas") {
        const category = menu.toppingCategories.find((c) => c.id === "frutas")
        const maxSelect = category && "maxSelect" in category ? category.maxSelect : undefined
        if (maxSelect != null && countToppingsInCategory(prev, "frutas") >= maxSelect) {
          return prev
        }
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
          {!isCasquinha && (
            <p className="text-sm text-zinc-500">Até 2 frutas inclusas no copo</p>
          )}
        </div>
        <span className="rounded-full bg-acai-100 px-3 py-1 text-sm font-semibold text-acai-800">
          {brl.format(lineTotal)}
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <p className="label">Tamanho</p>
          <div className="grid grid-cols-2 gap-2">
            {menu.sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => handleSizeChange(size.id)}
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
          <p className="mt-2 text-sm text-zinc-500">
            {isCasquinha
              ? "Acompanha leite em pó e leite condensado."
              : "Todos os tamanhos acompanham leite em pó e leite condensado."}
          </p>
        </div>

        {isCasquinha && (
          <p className="rounded-xl bg-acai-50 px-3 py-2 text-sm text-acai-800">
            Açaí na casquinha acompanha leite em pó e leite condensado. Adicionais opcionais abaixo.
          </p>
        )}

        {menu.toppingCategories
          .filter((category) => !isCategoryDisabledForSize(sizeId, category.id))
          .map((category) => {
          const fruitCount = category.id === "frutas" ? countToppingsInCategory(toppingIds, "frutas") : 0
          const maxSelect = "maxSelect" in category ? category.maxSelect : undefined

          return (
            <div key={category.id}>
              <p className="label">
                {category.name}
                {maxSelect != null && (
                  <span className="ml-1 font-normal text-zinc-400">
                    ({fruitCount}/{maxSelect})
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {category.toppings.map((topping) => {
                  const selected = toppingIds.includes(topping.id)
                  const atMax =
                    category.id === "frutas" &&
                    maxSelect != null &&
                    !selected &&
                    fruitCount >= maxSelect
                  const label =
                    "price" in topping && topping.price != null
                      ? `${topping.name} +${brl.format(topping.price)}`
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
            Observações deste copo
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
