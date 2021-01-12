declare type IWebsiteTemplateType = 'Agent' | 'Listing'

declare type IWebsiteTemplateMedium = 'Website'

declare interface IWebsite extends IModel<'website'> {
  title: string
  user: IUser | UUID
  brand: Nullable<IBrand>
  template: string
  template_instance: IMarketingTemplateInstance
  attributes: Record<string, string>
  hostnames: string[]
}

declare interface IDomainSuggest {
  available: boolean
  domain: string
  definitive: boolean
  price: number
  currency: 'USD'
  period: number
}
