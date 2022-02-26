import { memo } from 'react'

import {
  Chip,
  Theme,
  Button,
  makeStyles,
  CircularProgress
} from '@material-ui/core'
import cn from 'classnames'

interface Props {
  brand: IBrand
  isActive: boolean
  isFetchingUser: boolean
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
          display: 'inline-flex'
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

function Brand({ brand, isActive, isFetchingUser, disabled, onClick }: Props) {
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
      {!disabled && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={isFetchingUser}
          className={classes.switchButton}
          startIcon={
            isFetchingUser && <CircularProgress color="inherit" size={16} />
          }
          onClick={handleOnClick}
        >
          {isFetchingUser ? 'Loading...' : 'Select Account'}
        </Button>
      )}
    </div>
  )
}

export const TeamSwitchBrandSelectorRenderer = memo(Brand)
