import React, { useEffect } from 'react'

import { Box, Grid } from '@material-ui/core'

import useAsync from 'hooks/use-async'
import getWebsiteList from 'models/website/get-my-websites'

import WebsiteCard from '../WebsiteCard'
import WebsiteCardProvider from '../WebsiteCardProvider'
import WebsiteListProvider from '../WebsiteListProvider'
import WebsiteListState from '../WebsiteListState'

const defaultData: IWebsite[] = []

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
          {instances.map(instance => (
            <WebsiteCardProvider key={instance.id} website={instance}>
              <WebsiteCard {...instance} />
            </WebsiteCardProvider>
          ))}
        </WebsiteListProvider>
      </Grid>
    </Box>
  )
}

export default WebsiteList
