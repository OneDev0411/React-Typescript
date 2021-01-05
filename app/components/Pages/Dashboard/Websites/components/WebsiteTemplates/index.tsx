import React from 'react'

import TemplatesList from 'components/TemplatesList'

import useWebsiteTemplates from '../../hooks/use-website-templates'

export interface WebsiteTemplatesProps {
  type: IWebsiteTemplateType
}

function WebsiteTemplates({ type }: WebsiteTemplatesProps) {
  const { templates: items, isLoading } = useWebsiteTemplates(type)

  const handleDelete = () => console.log('on template delete')

  return (
    <TemplatesList
      items={items}
      isLoading={isLoading}
      type={type}
      medium="Website"
      onDelete={handleDelete}
    />
  )
}

export default WebsiteTemplates
