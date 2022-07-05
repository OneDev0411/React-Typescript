import { IKeyframe } from './types'

export function fixLeadingZero(value: number): string {
  const roundedValue = Math.floor(value)

  return roundedValue < 10
    ? `0${roundedValue.toFixed(0)}`
    : roundedValue.toFixed(0)
}

export function msToMinutesAndSeconds(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = (ms % 60000) / 1000

  return `${fixLeadingZero(minutes)}:${fixLeadingZero(seconds)}`
}

export function getSlotWidth(
  index: number,
  keyframes: IKeyframe[],
  duration: number
): number {
  const currentSlotStartTime = keyframes[index].at
  const nextSlotStartTime = keyframes[index + 1]?.at ?? duration
  const slotDuration = nextSlotStartTime - currentSlotStartTime

  return (slotDuration / duration) * 100
}

export function getSlotProgress(
  index: number,
  keyframes: IKeyframe[],
  currentTime: number,
  duration: number
): number {
  const currentSlotStartTime = keyframes[index].at
  const nextSlotStartTime = keyframes[index + 1]?.at ?? duration
  const slotDuration = nextSlotStartTime - currentSlotStartTime

  if (currentTime <= currentSlotStartTime) {
    return 0
  }

  if (currentTime >= nextSlotStartTime) {
    return 100
  }

  return ((currentTime - currentSlotStartTime) / slotDuration) * 100
}
