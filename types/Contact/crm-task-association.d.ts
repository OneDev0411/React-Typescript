declare type CRMTaskAssociationType = 'contact' | 'deal' | 'email' | 'listing'

declare type ICRMTaskAssociation<
  Associations extends CRMTaskAssociationType = ''
> = {
  id: UUID
  created_at: number
  updated_at: number
  deleted_at?: Nullable<number>
  created_by: UUID
  brand: UUID
  association_type: CRMTaskAssociationType
  crm_task: UUID
  index: Nullable<number>
  metadata: any
  type: 'crm_association'
} & Association<'contact', Nullable<IContact>, Associations> &
  Association<'deal', Nullable<IDeal>, Associations> &
  Association<'email', Nullable<IEmailCampaign>, Associations> &
  Association<'listing', Nullable<IListing>, Associations>
