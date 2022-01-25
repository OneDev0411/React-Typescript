export function isSuperCampaignEnrollmentOptedOut(
  enrollment: Pick<ISuperCampaignEnrollment, 'deleted_at'>
): boolean {
  return !!enrollment.deleted_at
}
