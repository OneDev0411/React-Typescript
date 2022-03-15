declare type ISocialPostAssociations = 'template_instance'

declare interface ISocialPost<A extends ISocialPostAssociations = ''>
  extends IModel<'social_post'> {
  facebookPage: UUID
  templateInstance: 'template_instance' extends A
    ? IMarketingTemplateInstance
    : UUID
  due_at: Date
  caption: string
}
