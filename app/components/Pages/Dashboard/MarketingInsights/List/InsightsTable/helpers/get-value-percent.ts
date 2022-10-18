export function getValuePercent(value: number, percent: number): string {
  return percent === 0 ? value.toString() : `${value} (${percent}%)`
}
