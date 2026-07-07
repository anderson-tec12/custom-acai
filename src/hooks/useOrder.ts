import { useCallback, useMemo, useState } from "react"
import type { BowlLine, OrderState, PaymentId } from "../types"
import { calcOrderTotal } from "../lib/whatsapp"

function newId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `bowl-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useOrder() {
  const [bowls, setBowls] = useState<BowlLine[]>([])
  const [paymentId, setPaymentId] = useState<PaymentId | "">("")

  const order: OrderState = useMemo(() => ({ bowls, paymentId }), [bowls, paymentId])

  const total = useMemo(() => calcOrderTotal(order), [order])

  const addBowl = useCallback((bowl: Omit<BowlLine, "id">) => {
    setBowls((prev) => [...prev, { ...bowl, id: newId() }])
  }, [])

  const removeBowl = useCallback((id: string) => {
    setBowls((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const itemCount = bowls.reduce((s, b) => s + b.quantity, 0)

  return {
    order,
    total,
    itemCount,
    addBowl,
    removeBowl,
    setPaymentId,
  }
}
