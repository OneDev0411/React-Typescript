import React, { useEffect } from 'react'

import useAsync from 'hooks/use-async'
import getWebsiteList from 'models/website/get-my-websites'

import SiteCardItem from '../SiteCardItem'
import CreateSampleWebsiteButton from '../CreateSampleWebsiteButton'

const defaultData: IWebsiteTemplateInstance[] = []

function WebsiteListInstances() {
  const { run, error } = useAsync({ data: defaultData })

  useEffect(() => {
    run(getWebsiteList)
  }, [run])

  if (error) {
    throw error
  }

  return (
    <>
      <CreateSampleWebsiteButton />
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
    </>
  )
}

export default WebsiteListInstances
