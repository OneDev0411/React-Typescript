declare type ISocialPostAssociations = 'template_instance' | 'owner'

declare interface ISocialPost<A extends ISocialPostAssociations = ''>
  extends IModel<'social_post'> {
  facebook_page: UUID
  template_instance: 'template_instance' extends A
    ? IMarketingTemplateInstance
    : UUID
  due_at: number
  caption: string
  brand: UUID
  executed_at: number
  failed_at: Nullable<number>
  failure: Nullable<string>
  post_link: string
  user: UUID
  owner: 'owner' extends A ? IUser : never
}
