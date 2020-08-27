declare interface IBrandMarketingTemplate extends IModel<'brand_template'> {
  template: IMarketingTemplate
  brand: UUID
  thumbnail_requested_at: Nullable<number>
  is_thumbnail_ready: Nullable<boolean>
  thumbnail: IFile
  preview: IFile
}

declare interface IMarketingTemplate extends IModel<'template'> {
  name: string
  brand: null
  template_type: string
  medium: MarketingTemplateMedium
  video: boolean
  url: string
  variant: string
  inputs: string[]
}

declare interface IMarketingTemplateInstance
  extends IModel<'template_instance'> {
  html: string
  file: IFile
  created_by: string
  branch: string
  template: IMarketingTemplate
  contacts: Nullable<IContact[]>
  deals: Nullable<IDeal[]>
  listings: Nullable<IListings[]>
}

declare enum MarketingTemplateMedium {
  Email = 'Email',
  Social = 'Social',
  Letter = 'Letter',
  LinkedInCover = 'LinkedInCover',
  FacebookCover = 'FacebookCover',
  InstagramStor = 'InstagramStory'
}
