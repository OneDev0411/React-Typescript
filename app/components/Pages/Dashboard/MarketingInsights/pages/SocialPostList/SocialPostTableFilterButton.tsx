import { Button, ButtonProps, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  {
    active: { cursor: 'default' }
  },
  { name: 'SocialPostTableFilterButton' }
)

interface SocialPostTableFilterButtonProps
  extends Omit<ButtonProps, 'variant' | 'size' | 'color' | 'startIcon'> {
  icon: string
  isActive: boolean
}

function SocialPostTableFilterButton({
  isActive,
  icon,
  className,
  ...buttonProps
}: SocialPostTableFilterButtonProps) {
  const classes = useStyles()

  return (
    <Button
      {...buttonProps}
      className={classNames(isActive && classes.active, className)}
      variant="outlined"
      color={isActive ? 'primary' : undefined}
      size="large"
      startIcon={<SvgIcon path={icon} size={muiIconSizes.small} />}
    />
  )
}

export default SocialPostTableFilterButton
