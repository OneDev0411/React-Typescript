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
  template_type: IMarketingTemplateType
  medium: IMarketingTemplateMedium
  video: boolean
  mjml: boolean
  url: string
  variant: string
  variables: Nullable<string[]>
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

declare interface ITemplateAsset extends IModel<'template_asset'> {
  created_by: UUID
  template: UUID
  contact: Nullable<UUID>
  listing: Nullable<UUID>
  file: IFile
}

declare type IMarketingTemplateMedium =
  | 'Email'
  | 'Social'
  | 'Letter'
  | 'LinkedInCover'
  | 'FacebookCover'
  | 'InstagramStory'

declare type IMarketingTemplateType =
  | 'Listing'
  | 'Contact'
  | 'CrmOpenHouse'
  | 'Birthday'
  | 'JustListed'
  | 'JustSold'
  | 'OpenHouse'
  | 'AsSeenIn'
  | 'PriceImprovement'
  | 'ComingSoon'
  | 'Listings'
  | 'NewYear'
  | 'Christmas'
  | 'Brand'
  | 'NewAgent'
  | 'Valentines'
  | 'StPatrick'
  | 'Easter'
  | 'OtherHoliday'
  | 'UnderContract'
  | 'Layout'
  | 'ListingLayout'
  | 'Newsletter'
  | 'FathersDay'
  | 'MothersDay'
  | 'ColumbusDay'
  | 'MemorialDay'
  | 'Passover'
  | 'ChineseNewYear'
  | 'LaborDay'
  | 'Hannukkah'
  | 'FourthOfJuly'
  | 'VeteransDay'
  | 'Thanksgiving'
  | 'Halloween'
  | 'MLKDay'
  | 'IndependenceDay'
  | 'Diwaly'
  | 'WomansDay'
  | 'Kwanzaa'
  | 'WeddingAnniversary'
  | 'HomeAnniversary'
  | 'RoshHashanah'
  | 'PatriotsDay'
  | 'BackToSchool'
