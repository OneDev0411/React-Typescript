import { memo } from 'react'

import { Chip, Theme, makeStyles } from '@material-ui/core'
import cn from 'classnames'

const useStyles = makeStyles(
  (theme: Theme) => ({
    name: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    disabled: {
      cursor: 'not-allowed',
      opacity: 0.5
    },
    activeIndicator: {
      marginLeft: theme.spacing(1)
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
    <div
      className={cn(classes.name, { [classes.disabled]: disabled })}
      onClick={handleOnClick}
    >
      {brand.name}
      {isActive && (
        <Chip
          size="small"
          label="You're here"
          className={classes.activeIndicator}
        />
      )}
    </div>
  )
}

export const TeamSwitchBrandSelectorRenderer = memo(Brand)
