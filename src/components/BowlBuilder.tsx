import { useMemo, useState } from "react"
import menu from "../menu.json"
import {
  brl,
  calcAccompanimentsPrice,
  calcBowlLineTotal,
  calcBowlUnitPrice,
  calcExtraFruitsPrice,
  countToppingsInCategory,
  getSize,
  getTopping,
} from "../lib/menu"
import type { SizeId } from "../types"

type BowlBuilderProps = {
  onAdd: (bowl: {
    sizeId: SizeId
    toppingIds: string[]
    notes: string
    quantity: number
  }) => void
}

export function BowlBuilder({ onAdd }: BowlBuilderProps) {
  const [sizeId, setSizeId] = useState<SizeId>(menu.sizes[1]?.id ?? menu.sizes[0].id)
  const [toppingIds, setToppingIds] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [quantity, setQuantity] = useState(1)

  const unitPrice = useMemo(() => {
    const size = getSize(sizeId)
    if (!size) return 0
    return size.price + calcBowlUnitPrice(toppingIds)
  }, [sizeId, toppingIds])

  const lineTotal = useMemo(
    () => calcBowlLineTotal(sizeId, toppingIds, quantity),
    [sizeId, toppingIds, quantity]
  )

  const extraFruitsPrice = useMemo(() => calcExtraFruitsPrice(toppingIds), [toppingIds])
  const accompanimentsPrice = useMemo(() => calcAccompanimentsPrice(toppingIds), [toppingIds])

  function toggleTopping(id: string) {
    const topping = getTopping(id)
    if (!topping) return

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
    onAdd({ sizeId, toppingIds, notes, quantity })
    setToppingIds([])
    setNotes("")
    setQuantity(1)
  }

  return (
    <section className="card">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-acai-900">Monte seu açaí</h2>
          <p className="text-sm text-zinc-500">Até 2 frutas inclusas no copo</p>
        </div>
        <span className="rounded-full bg-acai-100 px-3 py-1 text-sm font-semibold text-acai-800">
          {brl.format(lineTotal)}
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <p className="label">Tamanho</p>
          <div className="grid grid-cols-3 gap-2">
            {menu.sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setSizeId(size.id)}
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
        </div>

        {menu.toppingCategories.map((category) => {
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
          <label className="label" htmlFor="bowl-notes">
            Observações deste copo
          </label>
          <textarea
            id="bowl-notes"
            className="input min-h-20 resize-y"
            placeholder="Ex.: sem açúcar, pouco gelo..."
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
