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

export function getMarkerPosition(
  index: number,
  keyframes: IKeyframe[],
  duration: number
): `${number}%` {
  const currentSlotStartTime = keyframes[index].at

  return `${+((currentSlotStartTime * 100) / duration).toFixed(2)}%`
}

export function normalizeKeyframes(
  keyframes: IKeyframe[],
  duration: number
): IKeyframe[] {
  const normalizedKeyframes = [
    ...(keyframes[0].at > 0 ? [{ at: 0 }] : []),
    ...keyframes
  ]

  return normalizedKeyframes.filter(keyframe => keyframe.at < duration)
}
