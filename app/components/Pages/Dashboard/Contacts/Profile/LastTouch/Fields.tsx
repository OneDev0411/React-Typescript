import { useState } from 'react'

import { Link, makeStyles, Theme, Typography } from '@material-ui/core'
import { mdiBookEdit } from '@mdi/js'

import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      width: '100%',
      padding: theme.spacing(0.5, 1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: theme.palette.grey[600],
      borderRadius: theme.shape.borderRadius,
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'none',
        color: theme.palette.grey[600],
        background: theme.palette.action.hover
      }
    },
    value: {
      color: theme.palette.grey[900],
      textAlign: 'right'
    },
    videoModeActionBar: {
      position: 'absolute',
      top: '90%',
      right: '0',
      display: 'flex',
      zIndex: 1,
      visibility: 'visible'
    },
    videoModeActionBarActive: {
      visibility: 'visible'
    },
    action: {
      padding: theme.spacing(0, 2),
      background: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center',
      color: theme.palette.grey[800],
      '& svg': {
        color: theme.palette.grey[800],
        margin: 'auto'
      },
      '&:hover': {
        background: theme.palette.action.hover,
        textDecoration: 'none'
      }
    },
    actionLabel: {
      display: 'block',
      color: theme.palette.grey[800],
      ...theme.typography.caption
    },
    actionContainer: {
      display: 'flex',
      alignItems: 'center',
      background: theme.palette.background.paper,
      padding: theme.spacing(0.5),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4]
    }
  }),
  { name: 'LatTouchField' }
)

interface Props {
  title?: string
  value?: string
  isAction?: boolean
}

const Fields = ({ title, value, isAction }: Props) => {
  const classes = useStyles()
  const [showAction, setShowAction] = useState(false)

  return (
    <Link
      onMouseEnter={() => setShowAction(true)}
      onMouseLeave={() => setShowAction(false)}
      className={classes.container}
      target="_blank"
    >
      <Typography variant="body2">{title}</Typography>
      <Typography variant="body2" className={classes.value}>
        {value}
      </Typography>
      {isAction && showAction && (
        <div className={classes.videoModeActionBar}>
          <div className={classes.actionContainer}>
            <div className={classes.action}>
              <SvgIcon path={mdiBookEdit} size={muiIconSizes.small} />
              <span className={classes.actionLabel}>Edit</span>
            </div>
          </div>
        </div>
      )}
    </Link>
  )
}

export default Fields
