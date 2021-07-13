import React, { MouseEvent } from 'react'
import {
  IconButton,
  Typography,
  Tooltip,
  Theme,
  makeStyles
} from '@material-ui/core'
import { mdiPencilOutline, mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import IconCircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'start',
      padding: theme.spacing(1.5),
      // transition: 'box-shadow 1s ease-in',
      // box-shadow: 0 0 0 1px theme.palette.primary.main inset
      '&:nth-child(odd)': {
        background: theme.palette.grey[50]
      }
    },
    title: {
      marginRight: theme.spacing(1)
    },
    touchDate: {
      display: 'flex',
      margin: theme.spacing(0, 2)
    },
    touchDateCaption: {
      color: theme.palette.grey[500],
      marginRight: theme.spacing(0.5)
    },
    touchDateValue: {},
    actions: {
      display: 'flex'
    }
  }),
  {
    name: 'ManageTagsViewMode'
  }
)

interface Props {
  tag: IContactTag
  loading: boolean
  onEdit: (e: MouseEvent<HTMLElement>) => void
  onDelete: (tag: IContactTag) => void
}

export function ViewMode({ tag, loading, onEdit, onDelete }: Props) {
  const classes = useStyles()

  const onDeleteClick = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    onDelete(tag)
  }

  return (
    <div
      className={classes.container}
      // highlight={tag.highlight}
      // data-test={`tag-item-${tag.text}`}
    >
      <Typography variant="body2" className={classes.title}>
        {tag.text}
      </Typography>
      <div className={classes.touchDate}>
        {tag.touch_freq && (
          <Typography variant="caption" className={classes.touchDateCaption}>
            Touch:
          </Typography>
        )}
        <Typography variant="body2">
          {tag.touch_freq
            ? `every ${tag.touch_freq} days`
            : 'No touch reminder'}
        </Typography>
      </div>

      {loading ? (
        <div>
          <IconCircleSpinner />
        </div>
      ) : (
        <div className={classes.actions}>
          <Tooltip title="Delete tag">
            <IconButton size="small" onClick={onDeleteClick}>
              <SvgIcon path={mdiTrashCanOutline} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit tag">
            <IconButton size="small" onClick={onEdit}>
              <SvgIcon path={mdiPencilOutline} />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
