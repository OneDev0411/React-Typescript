export function isSuperCampaignEnrollmentOptedOut(
  enrollment: ISuperCampaignEnrollment<'user_and_brand'>
): boolean {
  // TODO: Implement the logic to detect opted-out options, asked Emil about this
  return false
}

export function getSuperCampaignResultPercentage(
  value: number,
  total: number
): string {
  if (!total) {
    return ''
  }

  const percentage = Math.round((value / total) * 100)

  return `(${percentage}%)`
}
