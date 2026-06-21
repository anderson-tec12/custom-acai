import menu from "./menu.json"

export type MenuConfig = typeof menu

export type SizeId = (typeof menu.sizes)[number]["id"]
export type PaymentId = (typeof menu.paymentMethods)[number]["id"]

export type BowlLine = {
  id: string
  sizeId: SizeId
  toppingIds: string[]
  notes: string
  quantity: number
  wantsCutlery: boolean
}

export type OrderState = {
  bowls: BowlLine[]
  paymentId: PaymentId | ""
}
