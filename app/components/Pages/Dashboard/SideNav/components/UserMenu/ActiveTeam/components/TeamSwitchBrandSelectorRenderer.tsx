import { memo } from 'react'

import { Button, Chip, Theme, makeStyles } from '@material-ui/core'
import cn from 'classnames'

interface Props {
  brand: IBrand
  isActive: boolean
  disabled: boolean
  onClick: (brand: IBrand) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    name: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 0),
      '&:hover': {
        padding: ({
          isActive,
          disabled
        }: Pick<Props, 'isActive' | 'disabled'>) =>
          !isActive && !disabled
            ? '0.161rem 0.161rem 0.161rem 0' // I'm using this strange value due to hokm hokumati :\
            : theme.spacing(1, 0),

        '& $switchButton': {
          display: 'block'
        }
      }
    },
    disabled: {
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

function Brand({ brand, isActive, disabled, onClick }: Props) {
  const classes = useStyles({ isActive, disabled })

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
          className={classes.switchButton}
          onClick={handleOnClick}
        >
          Select Team
        </Button>
      )}
    </div>
  )
}

export const TeamSwitchBrandSelectorRenderer = memo(Brand)
