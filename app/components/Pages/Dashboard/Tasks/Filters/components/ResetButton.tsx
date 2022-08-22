import {
  Button as BaseButton,
  ButtonProps,
  makeStyles,
  Theme
} from '@material-ui/core'

import { noop } from '@app/utils/helpers'

const useStyles = makeStyles(
  (theme: Theme) => ({
    background: {
      background: theme.palette.grey[100],
      padding: theme.spacing(0, 1)
    },
    root: {
      background: 'none !important'
    }
  }),
  {
    name: 'Tasks-Filters-ResetButton'
  }
)

interface Props extends ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  isActive?: boolean
}

export function ResetButton({
  title,
  onClick = noop,
  isActive = false,
  ...rest
}: Props) {
  const classes = useStyles()

  return (
    <div className={classes.background}>
      <BaseButton
        classes={{
          root: classes.root
        }}
        onClick={onClick}
        color={isActive ? 'secondary' : undefined}
        size="medium"
        {...rest}
      >
        Reset Filter
      </BaseButton>
    </div>
  )
}
