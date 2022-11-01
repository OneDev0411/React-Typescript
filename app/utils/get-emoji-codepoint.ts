export function getEmojiCodePoint(emoji: string): string {
  const hex = parseInt(`0x${emoji.charCodeAt(0)}`, 16)

  return String.fromCodePoint(hex)
}
