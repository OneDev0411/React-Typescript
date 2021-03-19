import React, { memo, useState } from 'react'

import classNames from 'classnames'

import { Link } from 'react-router'

import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Tooltip
} from '@material-ui/core'

import { useSelector } from 'react-redux'

import useAsync from 'hooks/use-async'

import deleteWebsite from 'models/website/delete-website'

import MarketingTemplateEditor from 'components/MarketingTemplateEditor'

import usePublishWebsite from 'hooks/use-publish-website'
import {
  convertToTemplate,
  getTemplateImage
} from 'utils/marketing-center/helpers'

import DomainManagementDrawer from 'components/DomainManagementDrawer'

import { generateWebsiteUrl } from 'utils/website'

import { selectUser } from 'selectors/user'

import useWebsiteListActions from '../WebsiteListProvider/use-website-list-actions'
import WebsiteCardImage from '../WebsiteCardImage'
import WebsiteCardTitle from '../WebsiteCardTitle'
import WebsiteCardActions from '../WebsiteCardActions'

import WebsiteCardMenu from '../WebsiteCardMenu'

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
  const user = useSelector(selectUser)

  const { thumbnail } = getTemplateImage(template_instance)

  const hostname = hostnames[0]

  const link = generateWebsiteUrl(hostname)

  const { isLoading: isWorking, run, isSuccess } = useAsync()
  const { deleteItem, updateItem } = useWebsiteListActions()

  const handleDelete = () => {
    run(async () => deleteWebsite(id)).then(() => deleteItem(id))
  }

  const openEditor = () => setIsEditorOpen(true)

  const closeEditor = () => setIsEditorOpen(false)

  const openDomainManagement = () => {
    setIsDomainManagementOpen(true)
  }

  const closeDomainManagement = () => setIsDomainManagementOpen(false)

  const {
    publishWebsite,
    isPublishing,
    publishButtonLabel
  } = usePublishWebsite(result => {
    updateItem(id, {
      template_instance: {
        ...result.instance,
        template: template_instance.template
      }
    })

    openDomainManagement()
  })

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

  const [isDomainManagementOpen, setIsDomainManagementOpen] = useState(false)

  const handleDomainAdd = (domainName: string, isDefault: boolean) => {
    updateItem(id, {
      hostnames: isDefault
        ? [domainName, ...hostnames]
        : [...hostnames, domainName]
    })
  }

  const handleDomainDelete = (domainName: string) => {
    updateItem(id, {
      hostnames: hostnames.filter(hostname => hostname !== domainName)
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
              onEdit={openEditor}
              onDelete={handleDelete}
            >
              <WebsiteCardMenu
                onEdit={openEditor}
                onDelete={handleDelete}
                onManageDomains={openDomainManagement}
              />
            </WebsiteCardActions>
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
          templateData={{
            user,
            listing: template_instance?.listings?.length
              ? template_instance?.listings[0]
              : undefined
          }}
          onSave={handleSave}
          onClose={closeEditor}
          saveButtonText={publishButtonLabel}
          saveButtonStartIcon={
            isPublishing && <CircularProgress color="inherit" size={20} />
          }
          actionButtonsDisabled={isPublishing}
          customActions={
            <Button
              type="button"
              variant="outlined"
              disabled={isPublishing}
              onClick={openDomainManagement}
            >
              Manage Domains
            </Button>
          }
          saveButtonWrapper={saveButton => (
            <Tooltip
              open={isPublishing}
              title="This might take a minute or two"
            >
              <span>{saveButton}</span>
            </Tooltip>
          )}
        />
      )}
      <DomainManagementDrawer
        open={isDomainManagementOpen}
        onClose={closeDomainManagement}
        onDomainAdd={handleDomainAdd}
        onDomainDelete={handleDomainDelete}
        websiteId={id}
        websiteTitle={!isEditorOpen ? title : undefined}
        websiteHostnames={hostnames}
      />
    </>
  )
}

export default memo(WebsiteCard)
