
import { brl, calcBowlLineTotal, getSize, getTopping } from "../lib/menu"
import type { BowlLine } from "../types"

type OrderCartProps = {
  bowls: BowlLine[]
  onRemoveBowl: (id: string) => void
}

export function OrderCart({ bowls, onRemoveBowl }: OrderCartProps) {
  if (bowls.length === 0) {
    return (
      <section className="card border-dashed">
        <h2 className="text-lg font-bold text-acai-900">Seu pedido</h2>
        <p className="mt-2 text-sm text-zinc-500">Nenhum item adicionado ainda. Monte seu açaí acima.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2 className="mb-4 text-lg font-bold text-acai-900">Seu pedido</h2>
      <ul className="space-y-3">
        {bowls.map((bowl) => {
          const size = getSize(bowl.sizeId)
          const lineTotal = calcBowlLineTotal(bowl.sizeId, bowl.toppingIds, bowl.quantity)
          const toppings = bowl.toppingIds.map((id) => getTopping(id)?.name ?? id).join(", ")

          return (
            <li
              key={bowl.id}
              className="rounded-xl border border-acai-100 bg-white px-3 py-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-zinc-800">
                    {bowl.quantity}x Açaí {size?.name ?? bowl.sizeId}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {toppings || "Sem complementos"}
                  </p>
                  {bowl.notes.trim() && (
                    <p className="mt-1 text-xs italic text-zinc-400">Obs.: {bowl.notes.trim()}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-acai-800">{brl.format(lineTotal)}</p>
                  <button
                    type="button"
                    className="mt-1 text-xs text-red-500 hover:underline"
                    onClick={() => onRemoveBowl(bowl.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
