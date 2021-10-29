export function isSuperCampaignEnrollmentOptedOut(
  enrollment: ISuperCampaignEnrollment<'user_and_brand'>
): boolean {
  // TODO: Implement the logic to detect opted-out options
  return false
}

export function getSuperCampaignResultPercentage(
  value: number,
  total: number
): string {
  if (!total) {
    return ''
  }

  return `(${(value / total) * 100}%)`
}
