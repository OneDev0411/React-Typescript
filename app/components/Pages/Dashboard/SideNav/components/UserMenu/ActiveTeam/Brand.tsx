import { useMemo, memo } from 'react'

import { Typography, Theme, makeStyles } from '@material-ui/core'
import cn from 'classnames'

const useStyles = makeStyles(
  (theme: Theme) => ({
    name: {
      padding: theme.spacing(1, 0),
      cursor: 'pointer'
    },
    disabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  }),
  { name: 'SwitchTeamNodeRenderer' }
)

interface Props {
  brand: IBrand
  onClick: (brand: IBrand) => void
}

function RawBrand({ brand, onClick }: Props) {
  const classes = useStyles()

  const isSelected: boolean = useMemo(() => {
    return false
  }, [])

  const handleOnClick = () => {
    if (isSelected) {
      return null
    }

    onClick(brand)
  }

  return (
    <div
      className={cn(classes.name, { [classes.disabled]: isSelected })}
      onClick={handleOnClick}
    >
      <Typography variant="body2">{brand.name}</Typography>
    </div>
  )
}

export const Brand = memo(RawBrand)
