import React, { memo, useState } from 'react'
import classNames from 'classnames'

import { Grid, Box, Typography } from '@material-ui/core'

import { Link } from 'react-router'

import useAsync from 'hooks/use-async'

import deleteWebsite from 'models/website/delete-website'

import MarketingTemplateEditor from 'components/MarketingTemplateEditor'

import useWebsiteListActions from '../WebsiteListProvider/use-website-list-actions'
import WebsiteCardImage from '../WebsiteCardImage'
import WebsiteCardTitle from '../WebsiteCardTitle'
import WebsiteCardActions from '../WebsiteCardActions'

import useStyles from './styles'

type WebsiteCardProps = IWebsiteTemplateInstance

function WebsiteCard({ id, title, hostnames, template }: WebsiteCardProps) {
  const classes = useStyles()
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const hostname = hostnames[0]
  const link = `http://${hostname}`

  const { isLoading: isWorking, run, isSuccess } = useAsync()
  const { deleteItem } = useWebsiteListActions()

  const handleDelete = () => {
    run(async () => deleteWebsite(id)).then(a => {
      if (isSuccess) {
        deleteItem(id)
      }
    })
  }

  const openEditor = () => setIsEditorOpen(true)

  const closeEditor = () => setIsEditorOpen(false)

  const handleSave = () => {
    alert('This feature is not implemented yet')
  }

  if (isSuccess) {
    return null
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Box className={classNames(classes.root, isWorking && classes.busy)}>
          <WebsiteCardImage
            className={classes.image}
            src="/static/images/websites/art.jpg"
            alt={`${title} website`}
          >
            <WebsiteCardActions
              className={classes.actions}
              link={link}
              onEditClick={openEditor}
              onDeleteClick={handleDelete}
            />
          </WebsiteCardImage>
          <WebsiteCardTitle websiteId={id} title={title} />
          <Typography variant="subtitle2" noWrap className={classes.footer}>
            <Link className={classes.link} to={link} target="_blank">
              {hostname}
            </Link>
          </Typography>
        </Box>
      </Grid>
      {isEditorOpen && (
        <MarketingTemplateEditor
          template={template}
          onSave={handleSave}
          onClose={closeEditor}
        />
      )}
    </>
  )
}

export default memo(WebsiteCard)
