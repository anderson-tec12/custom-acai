import { useCallback, useMemo, useState } from "react"
import type { BowlLine, CustomerInfo, OrderState, PaymentId, ProductLine } from "../types"
import { calcOrderTotal } from "../lib/whatsapp"

const emptyCustomer: CustomerInfo = {
  name: "",
  phone: "",
  deliveryType: "retirada",
  address: "",
  notes: "",
}

function newId() {
  return crypto.randomUUID()
}

export function useOrder() {
  const [bowls, setBowls] = useState<BowlLine[]>([])
  const [products, setProducts] = useState<ProductLine[]>([])
  const [customer, setCustomer] = useState<CustomerInfo>(emptyCustomer)
  const [paymentId, setPaymentId] = useState<PaymentId | "">("")

  const order: OrderState = useMemo(
    () => ({ bowls, products, customer, paymentId }),
    [bowls, products, customer, paymentId]
  )

  const total = useMemo(() => calcOrderTotal(order), [order])

  const addBowl = useCallback((bowl: Omit<BowlLine, "id">) => {
    setBowls((prev) => [...prev, { ...bowl, id: newId() }])
  }, [])

  const removeBowl = useCallback((id: string) => {
    setBowls((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const setProductQuantity = useCallback((productId: string, quantity: number) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.productId === productId)
      if (quantity <= 0) {
        return prev.filter((p) => p.productId !== productId)
      }
      if (idx === -1) {
        return [...prev, { id: newId(), productId, quantity }]
      }
      const next = [...prev]
      next[idx] = { ...next[idx], quantity }
      return next
    })
  }, [])

  const updateCustomer = useCallback((patch: Partial<CustomerInfo>) => {
    setCustomer((prev) => ({ ...prev, ...patch }))
  }, [])

  const itemCount = bowls.reduce((s, b) => s + b.quantity, 0) + products.reduce((s, p) => s + p.quantity, 0)

  return {
    order,
    total,
    itemCount,
    addBowl,
    removeBowl,
    setProductQuantity,
    updateCustomer,
    setPaymentId,
  }
}
