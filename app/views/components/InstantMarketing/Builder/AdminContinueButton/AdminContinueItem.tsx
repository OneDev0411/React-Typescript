import { MenuItem, MenuItemProps, makeStyles, alpha } from '@material-ui/core'
import classNames from 'classnames'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    root: {
      height: theme.spacing(9),
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(1),
      border: `1px solid ${alpha(theme.palette.common.black, 0.12)}`
    },
    icon: {
      width: theme.spacing(6),
      fontSize: 0
    }
  }),
  { name: 'AdminContinueItem' }
)

interface AdminContinueItemProps extends MenuItemProps {
  icon: string
}

function AdminContinueItem({
  icon,
  children,
  className,
  ...otherProps
}: AdminContinueItemProps) {
  const classes = useStyles()

  return (
    <MenuItem
      {...otherProps}
      button
      className={classNames(classes.root, className)}
    >
      <div className={classes.icon}>
        <SvgIcon path={icon} />
      </div>
      <div>{children}</div>
    </MenuItem>
  )
}

export default AdminContinueItem
