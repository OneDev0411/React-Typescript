import React, { useEffect } from 'react'

import useAsync from 'hooks/use-async'
import getWebsiteList from 'models/website/get-my-websites'

import SiteCardItem from '../SiteCardItem'
import CreateSampleWebsiteButton from '../CreateSampleWebsiteButton'
import WebsiteListState from '../WebsiteListState'
import WebsiteListInstanceProvider from '../WebsiteListInstanceProvider'

const defaultData: IWebsiteTemplateInstance[] = []

function WebsiteListInstances() {
  const { data: instances, run, isLoading, setData } = useAsync({
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
    <WebsiteListInstanceProvider setData={setData}>
      <CreateSampleWebsiteButton />
      {instances.map(instance => (
        <SiteCardItem key={instance.id} {...instance} />
      ))}
    </WebsiteListInstanceProvider>
  )
}

export default WebsiteListInstances
