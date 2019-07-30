export function hexToRgb(hex: string): number[] {
  const bigint = parseInt(hex.substr(-6), 16)

  const red = (bigint >> 16) & 255
  const green = (bigint >> 8) & 255
  const blue = bigint & 255

  return [red, green, blue]
}