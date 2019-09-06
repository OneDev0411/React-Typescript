declare type CRMTaskAssociationType = 'contact' | 'deal' | 'email' | 'listing'

declare type ICRMTaskAssociation<
  Associations extends CRMTaskAssociationType = ''
> = {
  id: UUID
  created_at: number
  updated_at: number
  deleted_at: number | null
  created_by: UUID
  brand: UUID
  association_type: CRMTaskAssociationType
  crm_task: UUID
  index: number | null
  metadata: any
  type: 'crm_association'
} & Association<'contact', IContact | null, Associations> &
  Association<'deal', IDeal | null, Associations> &
  Association<'email', IEmailCampaign | null, Associations> &
  Association<'listing', any | null, Associations>
