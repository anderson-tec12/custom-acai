import { useState } from "react"
import { useInstallPrompt } from "../hooks/useInstallPrompt"
import {
  dismissInstallBanner,
  isAppInstalled,
  isBannerDismissed,
  isIos,
} from "../lib/pwa"

export function InstallBanner() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const [visible, setVisible] = useState(
    () => !isAppInstalled() && !isBannerDismissed()
  )
  const [showIosHint, setShowIosHint] = useState(false)

  if (!visible) return null

  function handleDismiss() {
    dismissInstallBanner()
    setVisible(false)
  }

  async function handleInstall() {
    if (canInstall) {
      const accepted = await promptInstall()
      if (accepted) setVisible(false)
      return
    }

    if (isIos()) {
      setShowIosHint((current) => !current)
    }
  }

  const showInstallAction = canInstall || isIos()

  return (
    <div className="z-40 border-b border-acai-800 bg-acai-700 text-white shadow-lg">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3 sm:items-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-xl">
            📲
          </span>
          <div>
            <p className="text-sm font-semibold sm:text-base">
              Instale o app para acesso rápido ao seu pedido
            </p>
            {showIosHint && (
              <p className="mt-1 text-xs text-acai-100 sm:text-sm">
                Toque em Compartilhar e depois em Adicionar à Tela de Início
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {showInstallAction && (
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-acai-800 transition hover:bg-acai-50 active:scale-[0.98] sm:flex-none"
              onClick={handleInstall}
            >
              Instalar
            </button>
          )}
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 active:scale-[0.98] sm:flex-none"
            onClick={handleDismiss}
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  )
}
