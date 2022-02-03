import { memo } from 'react'

import { Button, Chip, Theme, makeStyles } from '@material-ui/core'
import cn from 'classnames'

const useStyles = makeStyles(
  (theme: Theme) => ({
    name: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '&:hover $switchButton': {
        display: 'block'
      }
    },
    disabled: {
      cursor: 'not-allowed',
      opacity: 0.5
    },
    switchButton: {
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
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleOnClick}
          className={classes.switchButton}
        >
          Select Team
        </Button>
      )}
    </div>
  )
}

export const TeamSwitchBrandSelectorRenderer = memo(Brand)
