import { TemplateTypeToMediumsMap } from '@app/hooks/use-marketing-center-mediums'
import { SectionCollection } from '@app/hooks/use-marketing-center-sections'

export interface MarketingSearchInputOption {
  label: string
  url: string
  section: string
}

export interface MarketingSearchInputProps {
  sections: SectionCollection
  templateTypeMediums: TemplateTypeToMediumsMap
  onSelect: (option: MarketingSearchInputOption) => void
}
