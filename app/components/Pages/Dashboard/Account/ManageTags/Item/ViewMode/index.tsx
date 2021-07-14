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
      width: '35%',
      maxWidth: '250px'
    },
    touchDate: {
      display: 'flex',
      width: '20%',
      maxWidth: '200px',
      padding: theme.spacing(0, 1)
    },
    touchDateCaption: {
      color: theme.palette.grey[500],
      marginRight: theme.spacing(0.5)
    },
    touchDateValue: {
      color: ({ tag }: Props) =>
        tag.touch_freq ? theme.palette.tertiary.dark : theme.palette.grey[500]
    },
    actions: {
      display: 'flex'
    }
  }),
  {
    name: 'ManageTagsViewMode'
  }
)

interface Props {
  tag: IContactTag & { highlight: boolean }
  loading: boolean
  onEdit: (e: MouseEvent<HTMLElement>) => void
  onDelete: (tag: IContactTag) => void
}

export function ViewMode({ tag, loading, onEdit, onDelete }: Props) {
  const classes = useStyles({ tag, loading, onEdit, onDelete })

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
        <Typography variant="body2" className={classes.touchDateValue}>
          {tag.touch_freq
            ? `every ${tag.touch_freq} days`
            : 'No touch reminder'}
        </Typography>
      </div>

      <div className={classes.actions}>
        <Tooltip title="Delete tag">
          <IconButton size="small" disabled={loading} onClick={onDeleteClick}>
            <SvgIcon path={mdiTrashCanOutline} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit tag">
          <IconButton size="small" disabled={loading} onClick={onEdit}>
            <SvgIcon path={mdiPencilOutline} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}
