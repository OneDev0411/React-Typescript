import React, { useEffect } from 'react'

import useAsync from 'hooks/use-async'
import getWebsiteList from 'models/website/get-my-websites'

import SiteCardItem from '../SiteCardItem'
import CreateSampleWebsiteButton from '../CreateSampleWebsiteButton'
import WebsiteListState from '../WebsiteListState'

const defaultData: IWebsiteTemplateInstance[] = []

function WebsiteListInstances() {
  const { data: instances, run, isLoading } = useAsync({
    data: defaultData,
    status: 'pending'
  })
  const isEmpty = !isLoading && instances.length === 0

  useEffect(() => {
    run(getWebsiteList)
  }, [run])

  if (isLoading || isEmpty) {
    return <WebsiteListState isLoading={isLoading} isEmpty={isEmpty} />
  }

  return (
    <>
      <CreateSampleWebsiteButton />
      {instances.map(instance => (
        <SiteCardItem key={instance.id} />
      ))}
    </>
  )
}

export default WebsiteListInstances
