import {
  Badge as BaseBadge,
  BadgeProps,
  createStyles,
  withStyles,
  Theme
} from '@material-ui/core'

interface ExtraBadgeProps extends BadgeProps {
  isOnline?: boolean
  statusColor?: string
}

export const Badge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      backgroundColor: (props: ExtraBadgeProps) => {
        if (props.statusColor) {
          return props.statusColor
        }

        return props.isOnline ? theme.palette.success.light : 'inherit'
      },
      color: (props: ExtraBadgeProps) => {
        if (props.statusColor) {
          return props.statusColor
        }

        return props.isOnline ? theme.palette.success.light : 'inherit'
      },
      boxShadow: (props: ExtraBadgeProps) =>
        props.isOnline || props.statusColor
          ? `0 0 0 2px ${theme.palette.background.paper}`
          : 'inherit'
    }
  })
)(BaseBadge)
