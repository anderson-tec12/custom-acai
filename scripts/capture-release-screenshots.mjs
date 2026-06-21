import { chromium, devices } from "playwright"
import { mkdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, "../docs/releases/v1.0/screenshots")
const baseUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:4173"

async function clickChip(page, pattern) {
  await page.getByRole("button", { name: pattern }).first().click()
}

async function captureDesktop(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await page.goto(baseUrl, { waitUntil: "networkidle" })

  await page.screenshot({ path: path.join(outDir, "01-home-desktop.png"), fullPage: true })

  await clickChip(page, /500ml/)
  await clickChip(page, /^Banana$/)
  await clickChip(page, /^Morango$/)
  await clickChip(page, /Paçoca/)
  await page.getByRole("checkbox").check()
  await page.getByLabel("Observações deste copo").fill("sem açúcar")
  await page.screenshot({ path: path.join(outDir, "02-bowl-builder.png"), fullPage: true })

  const cutlerySection = page.locator("section.card").filter({ hasText: "Deseja talher?" })
  await cutlerySection.scrollIntoViewIfNeeded()
  await cutlerySection.screenshot({ path: path.join(outDir, "03-cutlery-option.png") })

  await page.getByRole("button", { name: "Adicionar ao pedido" }).click()

  await clickChip(page, /300ml/)
  await clickChip(page, /Kiwi/)
  await clickChip(page, /Granola/)
  await page.getByRole("button", { name: "Adicionar ao pedido" }).click()

  await page.getByRole("button", { name: "PIX" }).click()
  await page.screenshot({ path: path.join(outDir, "04-cart-with-items.png"), fullPage: true })

  const paymentSection = page.locator("section.card").filter({ hasText: "Forma de pagamento" })
  await paymentSection.scrollIntoViewIfNeeded()
  await paymentSection.screenshot({ path: path.join(outDir, "05-payment-selector.png") })

  const confirmBar = page.locator(".sticky.bottom-0")
  await confirmBar.scrollIntoViewIfNeeded()
  await confirmBar.screenshot({ path: path.join(outDir, "06-confirm-bar.png") })

  await page.close()
}

async function captureMobile(browser) {
  const iPhone = devices["iPhone 13"]
  const page = await browser.newPage({
    ...iPhone,
    viewport: { width: 390, height: 844 },
  })
  await page.goto(baseUrl, { waitUntil: "networkidle" })
  await page.screenshot({ path: path.join(outDir, "07-install-banner-mobile.png"), fullPage: true })

  await page.getByRole("button", { name: "Instalar" }).click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(outDir, "08-install-banner-ios-hint.png"), fullPage: true })

  await page.close()
}

async function captureManifest(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await page.goto(baseUrl, { waitUntil: "networkidle" })

  const client = await page.context().newCDPSession(page)
  await client.send("DOM.enable")
  await page.evaluate(() => {
    // noop — ensure page is ready
  })

  await page.goto(`${baseUrl}/manifest.webmanifest`, { waitUntil: "networkidle" })
  await page.screenshot({ path: path.join(outDir, "09-pwa-manifest-devtools.png"), fullPage: true })

  await page.close()
}

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
try {
  await captureDesktop(browser)
  await captureMobile(browser)
  await captureManifest(browser)
  console.log("Screenshots saved to", outDir)
} finally {
  await browser.close()
}
