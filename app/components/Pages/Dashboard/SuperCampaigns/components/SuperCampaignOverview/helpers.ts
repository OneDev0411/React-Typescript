export function isSuperCampaignEnrollmentOptedOut(
  enrollment: ISuperCampaignEnrollment<'user' | 'brand'>
): boolean {
  return !!enrollment.deleted_at
}
