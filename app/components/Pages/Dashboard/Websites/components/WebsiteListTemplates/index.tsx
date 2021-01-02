import React, { useEffect } from 'react'

import useAsync from 'hooks/use-async'

import getWebsiteTemplates from 'models/website/get-website-templates'

export interface WebsiteListTemplatesProps {
  type: IWebsiteTemplateType
}

const defaultData: IWebsiteTemplate[] = []

function WebsiteListTemplates({ type }: WebsiteListTemplatesProps) {
  const { run, error } = useAsync({ data: defaultData })

  useEffect(() => {
    run(async () => getWebsiteTemplates(type))
  }, [type, run])

  if (error) {
    throw error
  }

  return <>There is no {type} template to display</>
}

export default WebsiteListTemplates
