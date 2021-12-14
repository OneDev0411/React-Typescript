import { memo } from 'react'

import { Typography, Chip, Theme, makeStyles } from '@material-ui/core'
import cn from 'classnames'

const useStyles = makeStyles(
  (theme: Theme) => ({
    name: {
      display: 'flex',
      alignItems: 'center',
      // padding: theme.spacing(1, 0),
      cursor: 'pointer'
    },
    active: {
      color: theme.palette.primary.main,
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
      <Typography variant="body2">{brand.name}</Typography>
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
