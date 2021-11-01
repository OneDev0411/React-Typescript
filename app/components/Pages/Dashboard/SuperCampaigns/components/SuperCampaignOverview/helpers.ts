export function isSuperCampaignEnrollmentOptedOut(
  enrollment: ISuperCampaignEnrollment<'user_and_brand'>
): boolean {
  return !!enrollment.deleted_at
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
