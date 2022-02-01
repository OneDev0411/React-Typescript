import { makeStyles, Theme } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: theme.spacing(1.5),
      width: theme.spacing(2.5),
      height: theme.spacing(2.5),
      top: theme.spacing(1) * -1,
      right: theme.spacing(1) * -1,
      background: theme.palette.error.main,
      color: theme.palette.common.white,
      borderRadius: '100%',
      border: `2px solid ${theme.palette.common.white}`,
      zIndex: 1
    }
  }),
  {
    name: 'DealGridNotification'
  }
)

interface Props {
  className?: string
  count: number
}

export function Notification({ className, count }: Props) {
  const classes = useStyles()
  const text =
    count >= 100 ? (
      <span>
        99<sup>+</sup>
      </span>
    ) : (
      count
    )

  return <div className={classNames(classes.root, className)}>{text}</div>
}
