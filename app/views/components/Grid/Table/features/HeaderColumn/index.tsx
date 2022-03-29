import { makeStyles, Theme, Typography } from '@material-ui/core'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    icon: {
      margin: theme.spacing(0, 1, 0, 2),
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
}

/**
 * The component represents the standard layout of a grid
 * column that contains text and icon
 */
export function HeaderColumn({ text, iconPath }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {iconPath && <SvgIcon className={classes.icon} path={iconPath} />}
      <Typography variant="body2" className={classes.title}>
        {text}
      </Typography>
    </div>
  )
}
