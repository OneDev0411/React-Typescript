declare interface ISuperCampaignWithEnrollment
  extends ISuperCampaign<'template_instance'> {
  enrollment: Optional<ISuperCampaignEnrollment>
}
