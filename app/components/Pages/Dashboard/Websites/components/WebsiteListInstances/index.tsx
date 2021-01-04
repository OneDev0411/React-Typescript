import React, { useEffect } from 'react'

import { Box, Grid } from '@material-ui/core'

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
    <Box paddingLeft={2} paddingRight={2} paddingTop={3}>
      <Grid container spacing={2}>
        <WebsiteListInstanceProvider setData={setData}>
          <CreateSampleWebsiteButton />
          {instances.map(instance => (
            <SiteCardItem key={instance.id} {...instance} />
          ))}
        </WebsiteListInstanceProvider>
      </Grid>
    </Box>
  )
}

export default WebsiteListInstances
