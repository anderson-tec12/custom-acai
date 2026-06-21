# Custom Açaí v1.0.0

Primeira release estável do **Custom Açaí** — app web para montar pedidos de açaí personalizados e enviar pelo WhatsApp, com suporte PWA (instalável na tela inicial).

---

## Capturas de tela

### Tela inicial (desktop)

![Tela inicial desktop](https://github.com/anderson-tec12/custom-acai/raw/v1.0.0/docs/releases/v1.0/screenshots/01-home-desktop.png)

### Montador de açaí

![Montador de açaí](https://github.com/anderson-tec12/custom-acai/raw/v1.0.0/docs/releases/v1.0/screenshots/02-bowl-builder.png)

### Opção de talher

![Opção de talher](https://github.com/anderson-tec12/custom-acai/raw/v1.0.0/docs/releases/v1.0/screenshots/03-cutlery-option.png)

### Carrinho com itens

![Carrinho com itens](https://github.com/anderson-tec12/custom-acai/raw/v1.0.0/docs/releases/v1.0/screenshots/04-cart-with-items.png)

### Forma de pagamento

![Forma de pagamento](https://github.com/anderson-tec12/custom-acai/raw/v1.0.0/docs/releases/v1.0/screenshots/05-payment-selector.png)

### Barra de confirmação

![Barra de confirmação](https://github.com/anderson-tec12/custom-acai/raw/v1.0.0/docs/releases/v1.0/screenshots/06-confirm-bar.png)

### Banner PWA (mobile)

![Banner PWA mobile](https://github.com/anderson-tec12/custom-acai/raw/v1.0.0/docs/releases/v1.0/screenshots/07-install-banner-mobile.png)

### Instruções iOS

![Instruções iOS](https://github.com/anderson-tec12/custom-acai/raw/v1.0.0/docs/releases/v1.0/screenshots/08-install-banner-ios-hint.png)

### Manifest PWA

![Manifest PWA](https://github.com/anderson-tec12/custom-acai/raw/v1.0.0/docs/releases/v1.0/screenshots/09-pwa-manifest-devtools.png)

---

## Funcionalidades

### Montador de copos
- Tamanhos: **300ml** (R$ 11,00) e **500ml** (R$ 16,00)
- Até **2 frutas inclusas** (Banana, Morango, Kiwi, Uva)
- Frutas extras e acompanhamentos com preço adicional
- **Talher opcional:** +R$ 0,50/un.
- Observações por copo e quantidade configurável

### Carrinho e pagamento
- Resumo detalhado por item com remoção individual
- Formas de pagamento: PIX, Dinheiro, Crédito, Débito
- Total calculado em tempo real

### WhatsApp
- Mensagem formatada com itens, preços, pagamento e total
- Abertura via `wa.me` com texto pré-preenchido

### PWA
- Instalável na tela inicial (Android/Chrome e iOS Safari)
- Banner de instalação com prompt nativo ou instruções iOS
- Service worker com cache offline de assets
- Modo standalone sem barra do navegador

---

## Stack técnica

| Tecnologia | Versão |
|------------|--------|
| Node.js | v20.20.2 |
| Vite | 5.4.21 |
| React | 19.2.4 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 3.4.19 |
| vite-plugin-pwa | 1.3.0 |

---

## Detalhes técnicos

### Precificação

```
total_linha = (preço_tamanho + extras) × quantidade + (talher ? 0.50 × quantidade : 0)
```

Cardápio em `src/menu.json`. Constante `CUTLERY_PRICE = 0.5` em `src/lib/menu.ts`.

### PWA

- **Manifest:** `theme_color: #7e22ce`, `display: standalone`, ícones 192/512 + maskable
- **Service Worker:** Workbox com precache + cache Google Fonts (1 ano)
- **Banner:** `sessionStorage` para dismiss por sessão; detecção de standalone iOS/Android
- **Registro SW:** `src/main.tsx` via `virtual:pwa-register`

### WhatsApp

- Endpoint: `https://wa.me/{phone}?text={encodedMessage}`
- Telefone: `5511939107270` (env vars previstas: `VITE_STORE_NAME`, `VITE_WHATSAPP_PHONE_E164`)

### Deploy

```bash
nvm use && npm install && npm run build
```

- Saída em `dist/`
- **HTTPS obrigatório** em produção para PWA

---

## Commits incluídos

- `1bfa4b4` — Início do projeto
- `f747cdf` — Customização da mensagem WhatsApp
- `d063f4f` — Ajustes na mensagem do WhatsApp
- `bb99df7` — Configuração Node via `.nvmrc`
- `a691d8a` — Ajuste da tabela de preços
- `f286d1b` — Adição da opção de talher
- `1bbb3cf` — Troca do texto informativo do talher
- `65cb84d` — PWA com banner de instalação

---

Documentação completa: [`docs/releases/v1.0/RELEASE_NOTES.md`](https://github.com/anderson-tec12/custom-acai/blob/v1.0.0/docs/releases/v1.0/RELEASE_NOTES.md)
