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
  listings: Nullable<IListing[]>
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
  | 'TwitterCover'
  | 'RealtorCover'
  | 'YouTubeCover'
  | IWebsiteTemplateMedium

declare type IMarketingTemplateType =
  | IWebsiteTemplateType
  | 'AsSeenIn'
  | 'BackToSchool'
  | 'Birthday'
  | 'Blank'
  | 'Blog'
  | 'BoxingDay'
  | 'Brand'
  | 'ChineseNewYear'
  | 'Christmas'
  | 'ColumbusDay'
  | 'ComingSoon'
  | 'Contact'
  | 'CrmOpenHouse'
  | 'DaylightSaving'
  | 'Diwali'
  | 'Easter'
  | 'EidalFitr'
  | 'Event'
  | 'FathersDay'
  | 'FourthOfJuly'
  | 'Halloween'
  | 'Hanukkah'
  | 'HomeAnniversary'
  | 'IndependenceDay'
  | 'JustListed'
  | 'JustSold'
  | 'Kwanzaa'
  | 'LaborDay'
  | 'Layout'
  | 'Listing'
  | 'ListingLayout'
  | 'Listings'
  | 'MarketReport'
  | 'MemorialDay'
  | 'MLKDay'
  | 'MothersDay'
  | 'NewAgent'
  | 'Recruiting'
  | 'News'
  | 'Newsletter'
  | 'NewYear'
  | 'OpenHouse'
  | 'OtherHoliday'
  | 'Passover'
  | 'PatriotsDay'
  | 'PriceImprovement'
  | 'Ramadan'
  | 'Recruitment'
  | 'RoshHashanah'
  | 'September11'
  | 'StPatrick'
  | 'Thanksgiving'
  | 'UnderContract'
  | 'Valentines'
  | 'VeteransDay'
  | 'WeddingAnniversary'
  | 'WomansDay'

declare type IMarketingTemplatePurpose =
  | 'ForMySelf'
  | 'ForOtherAgents'
  | 'ForCampaigns'
