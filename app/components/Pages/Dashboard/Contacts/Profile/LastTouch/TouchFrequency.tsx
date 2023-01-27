import { useState, MouseEvent } from 'react'

import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'

import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { frequencyToString } from '../../components/ManageRelationship/helper'
import { ManageRelationshipMenu } from '../../components/ManageRelationship/ManageRelationshipMenu'

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
      visibility: 'visible',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4]
    },
    actionIcon: {
      padding: theme.spacing(0, 2),
      background: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center',
      color: theme.palette.grey[800],
      '& svg': {
        color: theme.palette.grey[800],
        margin: theme.spacing(1, 'auto', 0, 'auto')
      },
      '&:hover': {
        background: theme.palette.action.hover,
        textDecoration: 'none'
      }
    },
    popoverContainer: {
      position: 'absolute',
      top: 0,
      left: 0
    },
    actionContainer: {
      display: 'flex',
      alignItems: 'center',
      background: theme.palette.background.paper,
      padding: theme.spacing(0.5),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4]
    },
    actionsWrapper: {
      width: '200px',
      display: 'flex',
      flexDirection: 'column'
    },
    action: {
      padding: theme.spacing(1, 2),
      background: theme.palette.background.paper,
      textAlign: 'center',
      color: theme.palette.grey[800],
      '&:hover': {
        background: theme.palette.action.hover,
        textDecoration: 'none'
      }
    },
    actionLabel: {
      display: 'block',
      color: theme.palette.grey[800],
      ...theme.typography.caption
    }
  }),
  { name: 'LatTouchField' }
)

interface Props {
  value: Nullable<number>
  onUpdateTouchFreq(newValue: Nullable<number>): void
}

const TouchFrequency = ({ value, onUpdateTouchFreq }: Props) => {
  const classes = useStyles()
  const [showAction, setShowAction] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(
    null
  )

  const isMenuOpen = Boolean(menuAnchorEl)

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setShowAction(false)
    setMenuAnchorEl(null)
  }

  const handleChangeTouchFreq = (newValue: Nullable<number>) => {
    handleClose()

    // Falsy values ('' / 0 / undefined) should be considered null in the backend
    const normalizedNewValue = newValue || null

    // To do the optimistic update,
    // we need to update the contact object in parent component
    onUpdateTouchFreq(normalizedNewValue)
  }

  const handleShowAction = () => {
    setShowAction(true)
  }

  const handleCloseAction = () => {
    setShowAction(false)
  }

  return (
    <>
      <Button
        variant="text"
        onMouseEnter={handleShowAction}
        onMouseLeave={handleCloseAction}
        className={classes.container}
        onClick={handleOpenMenu}
      >
        <Typography variant="body2">Auto Remind</Typography>
        <Typography variant="body2" className={classes.value}>
          {value ? frequencyToString(value) : 'Add Auto Remind'}
        </Typography>
        {showAction && (
          <div className={classes.videoModeActionBar}>
            <div className={classes.actionIcon}>
              <SvgIcon path={mdiPencilOutline} size={muiIconSizes.small} />
              <span className={classes.actionLabel}>Edit</span>
            </div>
          </div>
        )}
      </Button>
      {isMenuOpen && (
        <ManageRelationshipMenu
          anchorEl={menuAnchorEl}
          onClose={handleClose}
          contactTouchFreq={value}
          onChangeTouchFreq={handleChangeTouchFreq}
        />
      )}
    </>
  )
}

export default TouchFrequency
