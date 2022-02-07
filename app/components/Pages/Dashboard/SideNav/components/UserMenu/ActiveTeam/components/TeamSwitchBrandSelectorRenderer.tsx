import { memo } from 'react'

import { Chip, Theme, makeStyles } from '@material-ui/core'
import cn from 'classnames'

const useStyles = makeStyles(
  (theme: Theme) => ({
    name: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 0),
      '&:hover $switchButton': {
        display: 'block'
      }
    },
    disabled: {
      opacity: 0.5
    },
    switchButton: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      display: 'none'
    },
    activeIndicator: {
      marginLeft: theme.spacing(0.5)
    }
  }),
  { name: 'SwitchTeamNodeRenderer' }
)

interface Props {
  brand: IBrand
  isActive: boolean
  disabled: boolean
  onClick: (brand: IBrand) => void
}

function Brand({ brand, isActive, disabled, onClick }: Props) {
  const classes = useStyles()

  const handleOnClick = () => {
    if (disabled) {
      return null
    }

    onClick(brand)
  }

  return (
    <div className={cn(classes.name, { [classes.disabled]: disabled })}>
      <div>
        {brand.name}
        {isActive && (
          <Chip
            size="small"
            label="You're here"
            className={classes.activeIndicator}
          />
        )}
      </div>
      {!isActive && !disabled && (
        <span className={classes.switchButton} onClick={handleOnClick}>
          Select Team
        </span>
      )}
    </div>
  )
}

export const TeamSwitchBrandSelectorRenderer = memo(Brand)
