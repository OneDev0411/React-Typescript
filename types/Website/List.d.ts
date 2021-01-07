declare type IWebsiteTemplateType = 'Agent' | 'Listing'

declare type IWebsiteTemplateMedium = 'Website'

declare interface IWebsite extends IModel<'website'> {
  title: string
  user: IUser | UUID
  brand: Nullable<IBrand>
  template: string
  template_instance: IWebsiteTemplate
  attributes: Record<string, string>
  hostnames: string[]
}

declare type IWebsiteTemplate = IMarketingTemplate
