import { RefObject } from 'react'

interface BaseMarketingPickerProps {
  templateTypes: IMarketingTemplateType[]
  mediums?: IMarketingTemplateMedium[]
  containerRef?: RefObject<HTMLElement>
}

export interface MarketingTemplatePickerProps extends BaseMarketingPickerProps {
  user: IUser
  onSelect: (template: IBrandMarketingTemplate) => void
}

export interface MarketingTemplateInstancePickerProps
  extends BaseMarketingPickerProps {
  onSelect: (templateInstance: IMarketingTemplateInstance) => void
}

export interface MarketingTemplateAndTemplateInstancePickerProps
  extends BaseMarketingPickerProps {
  user: IUser
  onSelect: (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance
  ) => void
}
