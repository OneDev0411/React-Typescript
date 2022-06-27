import { Box, makeStyles, Theme, Typography } from '@material-ui/core'
import cn from 'classnames'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      userSelect: 'none',
      cursor: 'auto',
      '&.clickable': {
        cursor: 'pointer',
        '&:hover $title': {
          fontWeight: '600'
        }
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
  iconPath?: string
  sortIconPath?: string
  onClick?: () => void
}

/**
 * The component represents the standard layout of a grid
 * column that contains text and icon
 */
export function HeaderColumn({ text, iconPath, sortIconPath, onClick }: Props) {
  const classes = useStyles()

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className={cn(classes.root, {
        clickable: !!onClick
      })}
      onClick={onClick}
    >
      <Box display="flex" alignItems="center" width="90%">
        {iconPath && <SvgIcon className={classes.icon} path={iconPath} />}
        <Typography variant="body2" className={classes.title}>
          {text}
        </Typography>
      </Box>

      <Box display="flex" flexGrow={1} justifyContent="flex-end">
        {sortIconPath && (
          <SvgIcon className={classes.icon} path={sortIconPath} />
        )}
      </Box>
    </Box>
  )
}
