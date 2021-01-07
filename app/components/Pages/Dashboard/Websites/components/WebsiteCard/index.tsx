import React, { memo, useState } from 'react'
import classNames from 'classnames'

import { Grid, Box, Typography } from '@material-ui/core'

import { Link } from 'react-router'

import useAsync from 'hooks/use-async'

import deleteWebsite from 'models/website/delete-website'

import MarketingTemplateEditor from 'components/MarketingTemplateEditor'

import usePublishWebsite from 'hooks/use-publish-website'
import {
  convertToTemplate,
  getTemplateImage
} from 'utils/marketing-center/helpers'

import useWebsiteListActions from '../WebsiteListProvider/use-website-list-actions'
import WebsiteCardImage from '../WebsiteCardImage'
import WebsiteCardTitle from '../WebsiteCardTitle'
import WebsiteCardActions from '../WebsiteCardActions'

import useStyles from './styles'

type WebsiteCardProps = IWebsite

function WebsiteCard({
  id,
  title,
  hostnames,
  template_instance,
  attributes,
  template
}: WebsiteCardProps) {
  const classes = useStyles()
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const { thumbnail } = getTemplateImage(template_instance)

  const hostname = hostnames[0]
  const link = `http://${hostname}`

  const { isLoading: isWorking, run, isSuccess } = useAsync()
  const { deleteItem, updateItem } = useWebsiteListActions()

  const handleDelete = () => {
    run(async () => deleteWebsite(id)).then(() => deleteItem(id))
  }

  const openEditor = () => setIsEditorOpen(true)

  const closeEditor = () => setIsEditorOpen(false)

  const {
    publishWebsite,
    isPublishing,
    publishButtonLabel
  } = usePublishWebsite(result =>
    updateItem(id, {
      template_instance: {
        ...result.instance,
        template: template_instance.template
      }
    })
  )

  const handleSave = html => {
    const newInstance = {
      ...template_instance,
      listings: undefined,
      deals: undefined,
      contacts: undefined,
      html
    }

    publishWebsite(id, convertToTemplate(template_instance), newInstance, {
      title,
      attributes,
      template
    })
  }

  if (isSuccess) {
    return null
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={4} xl={3}>
        <Box className={classNames(classes.root, isWorking && classes.busy)}>
          <WebsiteCardImage
            className={classes.image}
            src={thumbnail}
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
          template={template_instance}
          onSave={handleSave}
          onClose={closeEditor}
          saveButtonText={publishButtonLabel}
          actionButtonsDisabled={isPublishing}
        />
      )}
    </>
  )
}

export default memo(WebsiteCard)
