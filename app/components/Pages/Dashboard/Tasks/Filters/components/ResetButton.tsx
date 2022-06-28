import {
  Button as BaseButton,
  ButtonProps,
  makeStyles
} from '@material-ui/core'

import { noop } from '@app/utils/helpers'

const useStyles = makeStyles(
  () => ({
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
    <BaseButton
      classes={{
        root: classes.root
      }}
      onClick={onClick}
      color={isActive ? 'secondary' : undefined}
      size="small"
      {...rest}
    >
      Reset
    </BaseButton>
  )
}
