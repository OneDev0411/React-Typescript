import React, { useRef } from 'react'
import cn from 'classnames'

import { Typography, Button, Grid } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import EditIcon from 'components/SvgIcons/Edit/EditIcon'
import SiteLinkIcon from 'components/SvgIcons/SiteLink/SiteLinkIcon'

import { SiteStatus } from './Status'
import { SiteMenu } from './Menu'
import SiteTitle, { TitleRef } from './Title'

import { Container, Actions, ArtContainer, Art, Link } from './styled'

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

function SiteCardItem() {
  const siteTitleRef = useRef<TitleRef>(null)
  const classes = useStyles()
  const iconClasses = useIconStyles()

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
                href="https://rechat.com"
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
                onClick={() =>
                  siteTitleRef.current && siteTitleRef.current.edit()
                }
              >
                <EditIcon
                  fill="#fff"
                  className={cn(iconClasses.small, iconClasses.rightMargin)}
                />
                Edit
              </Button>
            </div>

            <SiteMenu />
          </Actions>
        </ArtContainer>

        <SiteTitle ref={siteTitleRef} />

        <Link>
          <Typography variant="subtitle2">
            <a href="https://rechat.com" target="_blank">
              https://apple-juice.rechat.com/main
            </a>
          </Typography>
        </Link>

        <SiteStatus />
      </Container>
    </Grid>
  )
}

export default SiteCardItem
