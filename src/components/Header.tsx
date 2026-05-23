type HeaderProps = {
  storeName: string
}

export function Header({ storeName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-acai-100/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-acai-700 text-2xl shadow-lg shadow-acai-200">
          🥤
        </span>
        <div>
          <h1 className="text-xl font-bold text-acai-900 sm:text-2xl">{storeName}</h1>
          <p className="text-sm text-zinc-500">Monte seu açaí do jeito que você gosta</p>
        </div>
      </div>
    </header>
  )
}
