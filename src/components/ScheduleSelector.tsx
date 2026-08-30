type ScheduleSelectorProps = {
  scheduled: boolean
  scheduledTime: string
  onScheduledChange: (checked: boolean) => void
  onScheduledTimeChange: (value: string) => void
}

export function ScheduleSelector({
  scheduled,
  scheduledTime,
  onScheduledChange,
  onScheduledTimeChange,
}: ScheduleSelectorProps) {
  return (
    <section className="card">
      <h2 className="mb-4 text-lg font-bold text-acai-900">Agendamento</h2>

      <div>
        <label className="flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-acai-300 accent-acai-600"
            checked={scheduled}
            onChange={(e) => onScheduledChange(e.target.checked)}
          />
          <span className="text-sm font-medium text-zinc-700">Agendar pedido</span>
        </label>
      </div>

      {scheduled && (
        <div className="mt-4">
          <label className="label" htmlFor="scheduled-time">
            Horário
          </label>
          <input
            id="scheduled-time"
            type="time"
            className="input"
            value={scheduledTime}
            onChange={(e) => onScheduledTimeChange(e.target.value)}
            required
          />
        </div>
      )}
    </section>
  )
}
