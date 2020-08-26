import React, { Fragment } from 'react'
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  Tooltip,
  IconButton,
  Button,
  Theme,
  makeStyles
} from '@material-ui/core'
import { mdiDrag, mdiTrashCanOutline, mdiCameraOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { BaseFieldProps } from './types'

const useStyles = makeStyles((theme: Theme) => ({
  image: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  }
}))

interface Props extends BaseFieldProps<'sortableImageList'> {}

export default function SortableImageList({ variable, onChange }: Props) {
  const classes = useStyles()

  return (
    <>
      <List>
        {variable.images.map(image => (
          <Fragment key={image.name}>
            <ListItem button divider>
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  className={classes.image}
                  alt={image.label}
                  src={image.value}
                />
              </ListItemAvatar>
              <ListItemSecondaryAction>
                <Tooltip title="Delete photo" aria-label="Delete photo">
                  <IconButton>
                    <SvgIcon path={mdiTrashCanOutline} />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title="Drag photo to reorder"
                  aria-label="Drag photo to reorder"
                >
                  <IconButton>
                    <SvgIcon path={mdiDrag} />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          </Fragment>
        ))}
      </List>
      <Button color="primary" variant="contained">
        <SvgIcon path={mdiCameraOutline} />
        &nbsp; Add photo
      </Button>
    </>
  )
}
