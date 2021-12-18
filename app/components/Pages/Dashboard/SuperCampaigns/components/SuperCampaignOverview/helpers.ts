export function isSuperCampaignEnrollmentOptedOut(
  enrollment: ISuperCampaignEnrollment<'user_and_brand'>
): boolean {
  return !!enrollment.deleted_at
}
