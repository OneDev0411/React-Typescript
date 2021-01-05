import React, { useEffect } from 'react'

import { Box, Grid } from '@material-ui/core'

import useAsync from 'hooks/use-async'
import getWebsiteList from 'models/website/get-my-websites'

import WebsiteCard from '../WebsiteCard'
import CreateSampleWebsiteButton from '../CreateSampleWebsiteButton'
import WebsiteListState from '../WebsiteListState'
import WebsiteListProvider from '../WebsiteListProvider'

const defaultData: IWebsiteTemplateInstance[] = []

function WebsiteList() {
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
        <WebsiteListProvider setData={setData}>
          <CreateSampleWebsiteButton />
          {instances.map(instance => (
            <WebsiteCard key={instance.id} {...instance} />
          ))}
        </WebsiteListProvider>
      </Grid>
    </Box>
  )
}

export default WebsiteList
