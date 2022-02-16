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
    active: {
      cursor: 'not-allowed'
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
  onClick: (brand: IBrand) => void
}

function Brand({ brand, isActive, onClick }: Props) {
  const classes = useStyles()

  const handleOnClick = () => {
    if (isActive) {
      return null
    }

    onClick(brand)
  }

  return (
    <div
      className={cn(classes.name, { [classes.active]: isActive })}
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
