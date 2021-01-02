import React from 'react'
import { useSelector } from 'react-redux'

import { Grid, Box } from '@material-ui/core'

import { selectUserId } from 'selectors/user'

import createWebsite from 'models/website/create-website'

import Button from 'components/Button/AButton'
import useAsync from 'hooks/use-async'

function CreateSampleWebsiteButton() {
  const userId = useSelector(selectUserId)

  const { run } = useAsync()

  const handleClick = () => run(async () => createWebsite(userId))

  return (
    <Grid item xs={12}>
      <Button onClick={handleClick}>Create a sample website</Button>
      <Box display="inline-block" marginLeft={1}>
        You need to refresh to page to see the new item
      </Box>
    </Grid>
  )
}

export default CreateSampleWebsiteButton
