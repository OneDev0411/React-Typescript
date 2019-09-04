export function getRemainingRecipientsLabel(
  remaining: number,
  remainingBcc: number
) {
  if (remaining <= 0) {
    return ''
  }

  const firstPart = remaining !== remainingBcc ? `${remaining} other` : ''
  const secondPart = remainingBcc > 0 ? ` (${remainingBcc} Bcc)` : ''

  return [firstPart, secondPart].join(' ')
}
