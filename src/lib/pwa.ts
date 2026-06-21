const BANNER_DISMISSED_KEY = "install-banner-dismissed"

export function isAppInstalled(): boolean {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
  const isIosStandalone =
    (navigator as Navigator & { standalone?: boolean }).standalone === true

  return isStandalone || isIosStandalone
}

export function isBannerDismissed(): boolean {
  try {
    return sessionStorage.getItem(BANNER_DISMISSED_KEY) === "1"
  } catch {
    return false
  }
}

export function dismissInstallBanner(): void {
  try {
    sessionStorage.setItem(BANNER_DISMISSED_KEY, "1")
  } catch {
    // sessionStorage indisponível (modo privado restrito)
  }
}

export function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}
