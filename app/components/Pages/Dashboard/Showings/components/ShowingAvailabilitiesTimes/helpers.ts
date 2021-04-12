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

export function hasAnyOverlap(slots: IShowingAvailabilitySlot[]) {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const slot1 = slots[i]
      const slot2 = slots[j]

      if (slot1.weekday === slot2.weekday) {
        if (
          (slot1.availability[0] >= slot2.availability[0] &&
            slot1.availability[0] < slot2.availability[1]) ||
          (slot2.availability[0] >= slot1.availability[0] &&
            slot2.availability[0] < slot1.availability[1])
        ) {
          return true
        }
      }
    }
  }

  return false
}
