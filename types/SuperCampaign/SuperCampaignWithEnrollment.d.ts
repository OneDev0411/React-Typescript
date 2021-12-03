declare interface ISuperCampaignWithEnrollment
  extends ISuperCampaign<'template_instance_and_created_by'> {
  enrollment: Optional<ISuperCampaignEnrollment>
}
