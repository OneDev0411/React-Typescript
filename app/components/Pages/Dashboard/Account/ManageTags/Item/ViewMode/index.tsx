import { MouseEvent } from 'react'

import {
  IconButton,
  Typography,
  Tooltip,
  Theme,
  makeStyles
} from '@material-ui/core'
import { mdiPencilOutline, mdiTrashCanOutline } from '@mdi/js'
import pluralize from 'pluralize'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'start',
      padding: theme.spacing(1.5),
      '&:nth-child(even)': {
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
      color: ({ tag }: Pick<Props, 'tag'>) =>
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
  onEdit: (event: MouseEvent<HTMLElement>) => void
  onDelete: (tag: IContactTag) => void
}

export function ViewMode({ tag, loading, onEdit, onDelete }: Props) {
  const classes = useStyles({ tag })

  const onDeleteClick = () => {
    onDelete(tag)
  }

  return (
    <div className={classes.container}>
      <Typography noWrap variant="body2" className={classes.title}>
        {tag.text}
      </Typography>
      <div className={classes.touchDate}>
        {Number(tag.touch_freq) > 0 && (
          <Typography variant="caption" className={classes.touchDateCaption}>
            Touch:
          </Typography>
        )}
        <Typography variant="body2" className={classes.touchDateValue}>
          {Number(tag.touch_freq) > 0
            ? `every ${tag.touch_freq} ${pluralize('day', tag.touch_freq!)}`
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
