export type SuperCampaignFormValues = Pick<
  ISuperCampaign<'template_instance'>,
  'subject' | 'description' | 'due_at' | 'template_instance'
>

export interface SuperCampaignFormInternalValues
  extends Pick<
    ISuperCampaign<'template_instance'>,
    'subject' | 'description' | 'template_instance'
  > {
  due_at?: Date
}
