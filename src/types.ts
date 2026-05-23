import menu from "./menu.json"

export type MenuConfig = typeof menu

export type SizeId = (typeof menu.sizes)[number]["id"]
export type PaymentId = (typeof menu.paymentMethods)[number]["id"]
export type DeliveryId = (typeof menu.deliveryTypes)[number]["id"]

export type BowlLine = {
  id: string
  sizeId: SizeId
  toppingIds: string[]
  notes: string
  quantity: number
}

export type ProductLine = {
  id: string
  productId: string
  quantity: number
}

export type CustomerInfo = {
  name: string
  phone: string
  deliveryType: DeliveryId
  address: string
  notes: string
}

export type OrderState = {
  bowls: BowlLine[]
  products: ProductLine[]
  customer: CustomerInfo
  paymentId: PaymentId | ""
}
