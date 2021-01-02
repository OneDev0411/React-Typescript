declare type IWebsiteTemplateType = 'Agents' | 'Properties'

declare interface IWebsiteTemplateInstance extends IModel<'website'> {
  user: IUser
  brand: Nullable<IBrand>
  template: IWebsiteTemplateType
  attributes: Record<string, string>
  hostnames: string[]
}

declare interface IWebsiteTemplate extends IModel<'template'> {
  name: string
}
