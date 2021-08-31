import { RefObject } from 'react'

export type MyDesignsOrTemplateType = 'MyDesigns' | IMarketingTemplateType

interface BaseMarketingPickerProps {
  templateTypes: IMarketingTemplateType[]
  mediums?: IMarketingTemplateMedium[]
  containerRef?: RefObject<HTMLElement>
}

export interface MarketingTemplatePickerProps extends BaseMarketingPickerProps {
  user: IUser
  selectedTab?: IMarketingTemplateType
  onSelectTab?: (tab: IMarketingTemplateType) => void
  onSelect: (template: IBrandMarketingTemplate) => void
}

export interface MarketingTemplateInstancePickerProps
  extends BaseMarketingPickerProps {
  onSelect: (templateInstance: IMarketingTemplateInstance) => void
}

export interface MarketingTemplateAndTemplateInstancePickerProps
  extends BaseMarketingPickerProps {
  user: IUser
  selectedTab?: MyDesignsOrTemplateType
  onSelectTab?: (tab: MyDesignsOrTemplateType) => void
  onSelect: (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance
  ) => void
}
