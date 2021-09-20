export interface TemplateTypeWithMedium {
  type: IMarketingTemplateType
  medium?: IMarketingTemplateMedium
}

export interface MarketingSearchInputProps {
  types: TemplateTypeWithMedium[]
  onSelect: (result: TemplateTypeWithMedium) => void
}
