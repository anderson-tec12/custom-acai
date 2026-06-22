
import { useState } from "react"
import { BowlBuilder } from "./components/BowlBuilder"
import { ConfirmBar } from "./components/ConfirmBar"
import { Header } from "./components/Header"
import { OrderCart } from "./components/OrderCart"
import { PaymentSelector } from "./components/PaymentSelector"
import { useOrder } from "./hooks/useOrder"
import { buildWhatsappMessage, openWhatsappOrder } from "./lib/whatsapp"

const storeName = import.meta.env.VITE_STORE_NAME || "Custom Açaí"
const whatsappPhone =
  import.meta.env.VITE_WHATSAPP_PHONE_E164?.trim() || "5511939107270"

export function App() {
  const { order, total, itemCount, addBowl, removeBowl, setPaymentId } = useOrder()

  const [error, setError] = useState<string | undefined>()

  function validate(): string | undefined {
    if (order.bowls.length === 0) {
      return "Adicione pelo menos um copo ao pedido."
    }
    if (!order.paymentId) return "Selecione a forma de pagamento."
    return undefined
  }

  function handleConfirm() {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError(undefined)
    const message = buildWhatsappMessage(order, storeName)
    openWhatsappOrder(message, whatsappPhone)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header storeName={storeName} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-6">
            <BowlBuilder onAdd={addBowl} />
            <PaymentSelector value={order.paymentId} onChange={setPaymentId} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <OrderCart bowls={order.bowls} onRemoveBowl={removeBowl} />
          </aside>
        </div>
      </main>

      <ConfirmBar
        total={total}
        itemCount={itemCount}
        disabled={itemCount === 0}
        error={error}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
