export interface WebsiteTab {
  key: string
  title: string
  types: IMarketingTemplateType[]
}

export type WebsiteTabCollection = Record<string, WebsiteTab>

export interface WebsiteTabWithTemplates extends WebsiteTab {
  templates: IBrandMarketingTemplate[]
}

export type WebsiteTabWithTemplatesCollection = Record<
  string,
  WebsiteTabWithTemplates
>
