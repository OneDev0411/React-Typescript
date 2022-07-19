import { useEffect } from 'react'

import TemplatesList from 'components/TemplatesList'
import { goTo } from 'utils/go-to'

import { WebsitesRouteRoots } from '../../types'

export interface WebsiteTemplatesProps {
  types: IMarketingTemplateType[]
  items: IBrandMarketingTemplate[]
  isLoading: boolean
  routeRoot?: WebsitesRouteRoots
  onDelete: (template: IBrandMarketingTemplate) => void
}

function WebsiteTemplates({
  types,
  items,
  isLoading,
  routeRoot,
  onDelete
}: WebsiteTemplatesProps) {
  const isEmpty = items.length === 0

  useEffect(() => {
    if (!isLoading && isEmpty) {
      goTo(`/dashboard/${routeRoot}`)
    }
  }, [isLoading, isEmpty, routeRoot])

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
