export interface SuperCampaignWithEnrollment
  extends ISuperCampaign<'template_instance'> {
  enrollment: Optional<ISuperCampaignEnrollment>
}
