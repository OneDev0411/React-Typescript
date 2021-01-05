declare type IWebsiteTemplateType = 'Agent' | 'Listing'

declare type IWebsiteTemplateMedium = 'Website'

declare interface IWebsiteTemplateInstance extends IModel<'website'> {
  title: string
  user: IUser
  brand: Nullable<IBrand>
  template: IWebsiteTemplate
  attributes: Record<string, string>
  hostnames: string[]
}

declare interface IWebsiteTemplate extends IModel<'template'> {
  name: string
}
