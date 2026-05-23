
import menu from "../menu.json"
import type { CustomerInfo } from "../types"

type CustomerFormProps = {
  customer: CustomerInfo
  onChange: (patch: Partial<CustomerInfo>) => void
}

export function CustomerForm({ customer, onChange }: CustomerFormProps) {
  return (
    <section className="card">
      <h2 className="mb-4 text-lg font-bold text-acai-900">Seus dados</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="customer-name">Nome *</label>
          <input
            id="customer-name"
            className="input"
            placeholder="Seu nome"
            value={customer.name}
            onChange={(e) => onChange({ name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="customer-phone">WhatsApp *</label>
          <input
            id="customer-phone"
            className="input"
            type="tel"
            placeholder="(11) 99999-9999"
            value={customer.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <p className="label">Tipo de pedido</p>
          <div className="grid grid-cols-2 gap-2">
            {menu.deliveryTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => onChange({ deliveryType: type.id })}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  customer.deliveryType === type.id
                    ? "border-acai-600 bg-acai-600 text-white"
                    : "border-acai-200 bg-white hover:border-acai-400"
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {customer.deliveryType === "entrega" && (
          <div className="sm:col-span-2">
            <label className="label" htmlFor="customer-address">Endereço de entrega *</label>
            <input
              id="customer-address"
              className="input"
              placeholder="Rua, número, bairro, complemento"
              value={customer.address}
              onChange={(e) => onChange({ address: e.target.value })}
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="label" htmlFor="customer-notes">Observações gerais</label>
          <textarea
            id="customer-notes"
            className="input min-h-20 resize-y"
            placeholder="Ex.: interfone 123, pagar com nota de 50..."
            value={customer.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </div>
      </div>
    </section>
  )
}
