export function findSlotIndexById(slots: IShowingAvailabilitySlot[], id: UUID) {
  return slots.findIndex(slot => slot.id === id)
}

function fixLeadingZero(value: number): string {
  return value < 10 ? `0${value}` : value.toString()
}

export function timestampToHumanTime(timestamp: number): string {
  const hours = Math.floor(timestamp / 60 / 60)
  const minutes = Math.floor(timestamp / 60) - hours * 60

  return [fixLeadingZero(hours), ':', fixLeadingZero(minutes)].join('')
}

export function humanTimeToTimestamp(time: string): number {
  const [hours, minutes] = time.split(':')

  return parseInt(hours, 10) * 60 * 60 + parseInt(minutes, 10) * 60
}
