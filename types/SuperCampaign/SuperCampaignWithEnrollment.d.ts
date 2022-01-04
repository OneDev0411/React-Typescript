declare interface ISuperCampaignWithEnrollment
  extends ISuperCampaign<'template_instance' | 'created_by'> {
  enrollment: Optional<ISuperCampaignEnrollment>
}
