import React from 'react'

import TemplatesList from 'components/TemplatesList'

export interface WebsiteTemplatesProps {
  type: IWebsiteTemplateType
  items: IBrandMarketingTemplate[]
  isLoading: boolean
  onDelete: (template: IBrandMarketingTemplate) => void
}

function WebsiteTemplates({
  type,
  items,
  isLoading,
  onDelete
}: WebsiteTemplatesProps) {
  const selectedItems = items.filter(
    item => item.template.template_type === type
  )

  return (
    <TemplatesList
      items={selectedItems}
      isLoading={isLoading}
      type={type}
      medium="Website"
      onDelete={onDelete}
    />
  )
}

export default WebsiteTemplates
