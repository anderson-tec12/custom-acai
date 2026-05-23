/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_PHONE_E164: string
  readonly VITE_STORE_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
