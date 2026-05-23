
import { brl } from "../lib/menu"

type ConfirmBarProps = {
  total: number
  itemCount: number
  disabled: boolean
  error?: string
  onConfirm: () => void
}

export function ConfirmBar({ total, itemCount, disabled, error, onConfirm }: ConfirmBarProps) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-acai-100 bg-white/95 px-4 py-4 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-500">{itemCount} item(ns) no pedido</p>
          <p className="text-2xl font-bold text-acai-900">{brl.format(total)}</p>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <button
          type="button"
          className="btn-primary w-full text-base sm:w-auto sm:min-w-64"
          disabled={disabled}
          onClick={onConfirm}
        >
          <span className="text-lg">📲</span>
          Confirmar e enviar no WhatsApp
        </button>
      </div>
    </div>
  )
}
