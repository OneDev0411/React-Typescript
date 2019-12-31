import React from 'react'
import { Tooltip, Card, Button, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import MoreVertIcon from 'components/SvgIcons/MoreVert/IconMoreVert'
import IconAttachment from 'components/SvgIcons/Attachment/IconAttachment'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import {
  MediaThumbNailContainer,
  MediaThumbnail,
  MediaCard,
  Actions
} from '../../styled'

interface Props {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      minWidth: 'auto',
      marginLeft: theme.spacing(1),
      backgroundColor: theme.palette.action.active
    },
    trimmedText: {
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  })
)

export default function MediaItem() {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  return (
    <MediaCard>
      <MediaThumbNailContainer>
        <MediaThumbnail src="https://placeimg.com/300/250/arch" />
        <Actions>
          <div>
            <Tooltip title="Download Image">
              <Button
                color="secondary"
                variant="contained"
                size="small"
                className={classes.menuButton}
              >
                <IconAttachment
                  fill="#fff"
                  className={iconClasses.medium}
                  xlinkTitle="Helloooo"
                />
              </Button>
            </Tooltip>
            <Button
              color="secondary"
              variant="contained"
              size="small"
              className={classes.menuButton}
            >
              <MoreVertIcon fill="#fff" className={iconClasses.medium} />
            </Button>
          </div>
        </Actions>
      </MediaThumbNailContainer>
      <Typography variant="h6" component="h3">
        Image Title
      </Typography>
      <Typography variant="body1" className={classes.trimmedText}>
        Description goes here...
      </Typography>
    </MediaCard>
  )
}
