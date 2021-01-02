import React, { useRef } from 'react'
import cn from 'classnames'

import { Typography, Button, Grid } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import EditIcon from 'components/SvgIcons/Edit/EditIcon'
import SiteLinkIcon from 'components/SvgIcons/SiteLink/SiteLinkIcon'

import useAsync from 'hooks/use-async'

import deleteWebsite from 'models/website/delete-website'

import { SiteStatus } from './Status'
import { SiteMenu } from './Menu'
import SiteTitle, { TitleRef } from './Title'

import { Container, Actions, ArtContainer, Art, Link } from './styled'
import useWebsiteListInstanceActions from '../WebsiteListInstanceProvider/use-website-list-instance-actions'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginRight: theme.spacing(1)
    },
    linkButton: {
      color: `${theme.palette.common.white} !important`
    },
    transparentButton: {
      backgroundColor: theme.palette.action.active
    }
  })
)

type SiteCardItemProps = IWebsiteTemplateInstance

function SiteCardItem({ id, title, hostnames }: SiteCardItemProps) {
  const siteTitleRef = useRef<TitleRef>(null)
  const classes = useStyles()
  const iconClasses = useIconStyles()
  const { deleteWebsiteInstance } = useWebsiteListInstanceActions()

  const { isLoading: isWorking, run, isSuccess } = useAsync()

  const handleDelete = () => {
    run(async () => deleteWebsite(id)).then(() => deleteWebsiteInstance(id))
  }

  const handleEdit = () => {
    if (siteTitleRef.current) {
      siteTitleRef.current.edit()
    }
  }

  if (isWorking || isSuccess) {
    return null
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Container>
        <ArtContainer>
          <Art src="/static/images/websites/art.jpg" alt="" />

          <Actions>
            <div>
              <Button
                color="primary"
                variant="contained"
                size="small"
                className={cn(classes.button, classes.linkButton)}
                href={`http://${hostnames[0]}`}
                target="_blank"
              >
                <SiteLinkIcon
                  fillColor="#fff"
                  className={cn(iconClasses.small, iconClasses.rightMargin)}
                />
                Go To Site
              </Button>

              <Button
                color="secondary"
                variant="contained"
                size="small"
                className={classes.transparentButton}
                onClick={handleEdit}
                type="button"
              >
                <EditIcon
                  fill="#fff"
                  className={cn(iconClasses.small, iconClasses.rightMargin)}
                />
                Edit
              </Button>
            </div>

            <SiteMenu onDelete={handleDelete} onEdit={handleEdit} />
          </Actions>
        </ArtContainer>

        <SiteTitle ref={siteTitleRef} initialValue={title} websiteId={id} />

        <Link>
          <Typography variant="subtitle2">
            {hostnames.map(hostname => (
              <a href={`http://${hostname}`} target="_blank" key={hostname}>
                {hostname}
              </a>
            ))}
          </Typography>
        </Link>

        <SiteStatus />
      </Container>
    </Grid>
  )
}

export default SiteCardItem
