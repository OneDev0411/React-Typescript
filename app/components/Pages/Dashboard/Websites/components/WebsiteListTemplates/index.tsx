import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'

import useAsync from 'hooks/use-async'

import TemplatesList from 'components/TemplatesList'
import getWebsiteTemplates from 'models/website/get-website-templates'
import { selectActiveBrandId } from 'selectors/brand'

export interface WebsiteListTemplatesProps {
  type: IWebsiteTemplateType
}

const defaultData: IWebsiteTemplate[] = []

function WebsiteListTemplates({ type }: WebsiteListTemplatesProps) {
  const brandId = useSelector(selectActiveBrandId)
  const { run, data: items, isLoading } = useAsync({ data: defaultData })

  useEffect(() => {
    run(async () => getWebsiteTemplates(brandId))
  }, [type, run, brandId])

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

export default WebsiteListTemplates
