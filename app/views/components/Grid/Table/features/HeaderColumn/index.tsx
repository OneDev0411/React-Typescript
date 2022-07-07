import { Box, makeStyles, Theme, Typography } from '@material-ui/core'
import cn from 'classnames'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      userSelect: 'none',
      cursor: 'auto',
      padding: theme.spacing(0, 1, 0, 2),
      '&.clickable': {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: theme.palette.action.hover
        },
        '&:hover $title': {
          fontWeight: 600
        }
      },
      '&.active': {
        fontWeight: 600,
        backgroundColor: theme.palette.action.hover
      }
    },
    icon: {
      marginRight: theme.spacing(1),
      color: theme.palette.grey['700'],
      width: `${theme.spacing(2)}px !important`,
      height: `${theme.spacing(2)}px !important`
    },
    title: {
      fontWeight: 400,
      color: theme.palette.grey['900']
    }
  }),
  {
    name: 'Grid-HeaderColumn'
  }
)

interface Props {
  text: string | React.ReactNode
  isActive?: boolean
  iconPath?: string
  sortIconPath?: string
  onClick?: () => void
}

/**
 * The component represents the standard layout of a grid
 * column that contains text and icon
 */
export function HeaderColumn({
  text,
  iconPath,
  sortIconPath,
  isActive,
  onClick
}: Props) {
  const classes = useStyles()

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      height="100%"
      className={cn(classes.root, {
        clickable: !!onClick,
        active: isActive
      })}
      onClick={onClick}
    >
      <Box display="flex" alignItems="center" flexGrow={1}>
        {iconPath && <SvgIcon className={classes.icon} path={iconPath} />}
        <Typography variant="body2" className={classes.title}>
          {text}
        </Typography>
      </Box>

      {sortIconPath && (
        <Box display="flex" width="24px" justifyContent="flex-end">
          <SvgIcon className={classes.icon} path={sortIconPath} />
        </Box>
      )}
    </Box>
  )
}
