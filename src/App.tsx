
import { useMemo, useState } from "react"
import { BowlBuilder } from "./components/BowlBuilder"
import { ConfirmBar } from "./components/ConfirmBar"
import { CustomerForm } from "./components/CustomerForm"
import { Header } from "./components/Header"
import { OrderCart } from "./components/OrderCart"
import { PaymentSelector } from "./components/PaymentSelector"
import { ProductPicker } from "./components/ProductPicker"
import { useOrder } from "./hooks/useOrder"
import { buildWhatsappMessage, openWhatsappOrder } from "./lib/whatsapp"

const storeName = import.meta.env.VITE_STORE_NAME || "Custom Açaí"
const whatsappPhone = "5511939107270"

export function App() {
  const {
    order,
    total,
    itemCount,
    addBowl,
    removeBowl,
    setProductQuantity,
    updateCustomer,
    setPaymentId,
  } = useOrder()

  const [error, setError] = useState<string | undefined>()

  const productQuantities = useMemo(() => {
    const map: Record<string, number> = {}
    for (const line of order.products) {
      map[line.productId] = line.quantity
    }
    return map
  }, [order.products])

  function validate(): string | undefined {
    if (order.bowls.length === 0 && order.products.length === 0) {
      return "Adicione pelo menos um item ao pedido."
    }
    if (!order.customer.name.trim()) return "Informe seu nome."
    if (!order.customer.phone.trim()) return "Informe seu WhatsApp."
    if (order.customer.deliveryType === "entrega" && !order.customer.address.trim()) {
      return "Informe o endereço para entrega."
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
            <ProductPicker quantities={productQuantities} onChange={setProductQuantity} />
            <CustomerForm customer={order.customer} onChange={updateCustomer} />
            <PaymentSelector value={order.paymentId} onChange={setPaymentId} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <OrderCart bowls={order.bowls} products={order.products} onRemoveBowl={removeBowl} />
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
