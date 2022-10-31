import { useState } from 'react'

import { Divider, Link, makeStyles, Theme, Typography } from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'

import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { ManageRelationshipCustomItem } from './CustomTouchFrequency'

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
    actionIcon: {
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
    },
    actionsWrapper: {
      width: '200px',
      display: 'flex',
      flexDirection: 'column'
    }
  }),
  { name: 'LatTouchField' }
)

interface Props {
  value?: number
  onUpdateTouchFreq(newValue: Nullable<number>): void
}

export const frequencyOptions = {
  7: 'Weekly',
  30: 'Monthly',
  60: 'Bimonthly',
  90: 'Quarterly',
  180: 'Semiannually',
  365: 'Annually'
}

const TouchFrequency = ({ value, onUpdateTouchFreq }: Props) => {
  const classes = useStyles()
  const [showAction, setShowAction] = useState(false)
  const [handleShowAction, setHandleShowAction] = useState(false)
  const [showCustom, setShowCustom] = useState(false)

  return (
    <Link
      onMouseEnter={() => setShowAction(true)}
      onMouseLeave={() => {
        setShowAction(false)
        setHandleShowAction(false)
        setShowCustom(false)
      }}
      className={classes.container}
      target="_blank"
    >
      <Typography variant="body2">Touch Frequency</Typography>
      <Typography variant="body2" className={classes.value}>
        Every {value} {value === 1 ? 'day' : 'days'}
      </Typography>
      {showAction && (
        <div className={classes.videoModeActionBar}>
          <div className={classes.actionContainer}>
            {handleShowAction ? (
              showCustom ? (
                <ManageRelationshipCustomItem
                  contactTouchFreq={value || null}
                  onChangeTouchFreq={onUpdateTouchFreq}
                />
              ) : (
                <div className={classes.actionsWrapper}>
                  {Object.keys(frequencyOptions).map(key => (
                    <div
                      onClick={() => onUpdateTouchFreq(Number(key))}
                      key={key}
                      className={classes.action}
                    >
                      {frequencyOptions[key]}
                    </div>
                  ))}
                  <Divider />
                  <div
                    onClick={() => setShowCustom(true)}
                    className={classes.action}
                  >
                    Custom...
                  </div>
                </div>
              )
            ) : (
              <div
                onClick={() => setHandleShowAction(true)}
                className={classes.actionIcon}
              >
                <SvgIcon path={mdiPencilOutline} size={muiIconSizes.small} />
                <span className={classes.actionLabel}>Edit</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Link>
  )
}

export default TouchFrequency
