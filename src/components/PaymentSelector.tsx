
import menu from "../menu.json"
import type { PaymentId } from "../types"

type PaymentSelectorProps = {
  value: PaymentId | ""
  onChange: (id: PaymentId) => void
}

export function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  return (
    <section className="card">
      <h2 className="mb-4 text-lg font-bold text-acai-900">Forma de pagamento</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {menu.paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
              value === method.id
                ? "border-acai-600 bg-acai-600 text-white shadow-sm"
                : "border-acai-200 bg-white hover:border-acai-400"
            }`}
          >
            {method.name}
          </button>
        ))}
      </div>
    </section>
  )
}
