import React from 'react'
import { useSelector } from 'react-redux'

import { Grid } from '@material-ui/core'

import { selectUserId } from 'selectors/user'

import createWebsite from 'models/website/create-website'

import Button from 'components/Button/AButton'
import useAsync from 'hooks/use-async'

import useWebsiteListInstanceActions from '../WebsiteListInstanceProvider/use-website-list-instance-actions'

function CreateSampleWebsiteButton() {
  const userId = useSelector(selectUserId)
  const { addWebsiteInstance } = useWebsiteListInstanceActions()

  const { run, isLoading } = useAsync<IWebsiteTemplateInstance>()

  const handleClick = () => {
    run(async () => createWebsite(userId)).then(instance =>
      addWebsiteInstance(instance)
    )
  }

  return (
    <Grid item xs={12}>
      <Button onClick={handleClick} disabled={isLoading}>
        Create a sample website
      </Button>
    </Grid>
  )
}

export default CreateSampleWebsiteButton
