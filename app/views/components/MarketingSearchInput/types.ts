export interface TemplateTypeWithMedium {
  type: IMarketingTemplateType
  label: string
  medium?: IMarketingTemplateMedium
}

export interface MarketingSearchInputProps {
  types: TemplateTypeWithMedium[]
  onSelect: (result: TemplateTypeWithMedium) => void
}
