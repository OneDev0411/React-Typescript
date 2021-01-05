import React, { memo, useState, useCallback } from 'react'

import { Grid, Box, Typography } from '@material-ui/core'

import { Link } from 'react-router'

import useAsync from 'hooks/use-async'

import deleteWebsite from 'models/website/delete-website'

import useWebsiteListActions from '../WebsiteListProvider/use-website-list-actions'
import WebsiteCardImage from '../WebsiteCardImage'
import WebsiteCardTitle from '../WebsiteCardTitle'
import WebsiteCardActions from '../WebsiteCardActions'

import useStyles from './styles'

type WebsiteCardProps = IWebsiteTemplateInstance

function WebsiteCard({ id, title, hostnames }: WebsiteCardProps) {
  const classes = useStyles()
  const [editMode, setEditMode] = useState(false)

  const hostname = hostnames[0]
  const link = `http://${hostname}`

  const handleEditStart = useCallback(() => setEditMode(true), [])
  const handleEditEnd = useCallback(() => setEditMode(false), [])

  const { isLoading: isWorking, run, isSuccess } = useAsync()
  const { deleteItem } = useWebsiteListActions()

  const handleDelete = () => {
    run(async () => deleteWebsite(id)).then(() => deleteItem(id))
  }

  if (isWorking || isSuccess) {
    return null
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Box className={classes.root}>
        <WebsiteCardImage
          className={classes.image}
          src="/static/images/websites/art.jpg"
          alt={`${title} website`}
        >
          <WebsiteCardActions
            className={classes.actions}
            link={link}
            onEditClick={handleEditStart}
            onDeleteClick={handleDelete}
          />
        </WebsiteCardImage>
        <WebsiteCardTitle
          websiteId={id}
          title={title}
          onEditStart={handleEditStart}
          onEditEnd={handleEditEnd}
          editable={editMode}
        />
        <Typography variant="subtitle2" noWrap className={classes.footer}>
          <Link className={classes.link} to={link} target="_blank">
            {hostname}
          </Link>
        </Typography>
      </Box>
    </Grid>
  )
}

export default memo(WebsiteCard)
