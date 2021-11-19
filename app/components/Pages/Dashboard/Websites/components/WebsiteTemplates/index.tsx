import { useEffect } from 'react'

import TemplatesList from 'components/TemplatesList'
import { goTo } from 'utils/go-to'

export interface WebsiteTemplatesProps {
  types: IMarketingTemplateType[]
  items: IBrandMarketingTemplate[]
  isLoading: boolean
  onDelete: (template: IBrandMarketingTemplate) => void
}

function WebsiteTemplates({
  types,
  items,
  isLoading,
  onDelete
}: WebsiteTemplatesProps) {
  const isEmpty = items.length === 0

  useEffect(() => {
    if (!isLoading && isEmpty) {
      goTo('/dashboard/websites')
    }
  }, [isLoading, isEmpty])

  if (isEmpty) {
    return null
  }

  return (
    <TemplatesList
      items={items}
      isLoading={isLoading}
      type={types.join(',')}
      medium="Website"
      onDelete={onDelete}
    />
  )
}

export default WebsiteTemplates
