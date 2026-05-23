
import menu from "../menu.json"
import { brl } from "../lib/menu"

type ProductPickerProps = {
  quantities: Record<string, number>
  onChange: (productId: string, quantity: number) => void
}

export function ProductPicker({ quantities, onChange }: ProductPickerProps) {
  return (
    <section className="card">
      <h2 className="mb-4 text-lg font-bold text-acai-900">Outros produtos</h2>
      <div className="space-y-3">
        {menu.standaloneProducts.map((product) => {
          const qty = quantities[product.id] ?? 0
          return (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-acai-100 bg-acai-50/50 px-3 py-2"
            >
              <div>
                <p className="font-medium text-zinc-800">{product.name}</p>
                <p className="text-sm text-zinc-500">{brl.format(product.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-secondary h-8 w-8 rounded-full p-0 text-base"
                  onClick={() => onChange(product.id, Math.max(0, qty - 1))}
                  aria-label={`Diminuir ${product.name}`}
                >
                  −
                </button>
                <span className="min-w-6 text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  className="btn-secondary h-8 w-8 rounded-full p-0 text-base"
                  onClick={() => onChange(product.id, qty + 1)}
                  aria-label={`Aumentar ${product.name}`}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
