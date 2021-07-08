import React from 'react'
import {
  IconButton,
  Typography,
  Tooltip,
  Theme,
  makeStyles
} from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import IconCircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1.5),
      // transition: 'box-shadow 1s ease-in',
      // box-shadow: 0 0 0 1px theme.palette.primary.main inset
      '&:nth-child(odd)': {
        background: theme.palette.grey[50]
      }
    },
    title: {
      marginRight: theme.spacing(1)
    }
  }),
  {
    name: 'ManageTagsViewMode'
  }
)

export function ViewMode({ tag, loading, onDelete }) {
  const classes = useStyles()

  console.log({ tag })

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

      {loading ? (
        <div>
          <IconCircleSpinner />
        </div>
      ) : (
        <Tooltip title="Delete tag">
          <IconButton size="small" onClick={onDeleteClick}>
            <SvgIcon path={mdiTrashCanOutline} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}
