import {
  MenuItem,
  MenuItemProps,
  makeStyles,
  alpha,
  Typography
} from '@material-ui/core'
import classNames from 'classnames'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    root: {
      height: theme.spacing(11),
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(1),
      border: `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
      whiteSpace: 'normal'
    },
    icon: {
      width: theme.spacing(6),
      fontSize: 0,
      flexShrink: 0,
      flexGrow: 0
    },
    helpText: { color: theme.palette.grey[600] }
  }),
  { name: 'MarketingTemplatePurposeOption' }
)

interface MarketingTemplatePurposeOptionProps
  extends Omit<MenuItemProps, 'children'> {
  icon: string
  title: string
  description: string
}

function MarketingTemplatePurposeOption({
  icon,
  title,
  description,
  className,
  ...otherProps
}: MarketingTemplatePurposeOptionProps) {
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
      <div>
        <Typography variant="body1">{title}</Typography>
        <Typography className={classes.helpText} variant="body2">
          {description}
        </Typography>
      </div>
    </MenuItem>
  )
}

export default MarketingTemplatePurposeOption
