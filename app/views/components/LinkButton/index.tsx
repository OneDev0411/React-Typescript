import { Button, makeStyles, ButtonProps } from '@material-ui/core'
import classNames from 'classnames'

import withLinkButton, { MakeWithLinkButtonProps } from '../with-link-button'

export type LinkButtonProps = MakeWithLinkButtonProps<ButtonProps>

// TODO: There is a CSS conflict with bootstrap styles. This logic
// tries to override the button color to overcome the problem.
// Please remove this when the bootstrap style get removed
const useStyles = makeStyles(
  {
    // TODO: remove this when the bootstrap styles got removed
    override: {
      color: 'white',
      '&:hover, &:focus': { color: 'white' }
    }
  },
  { name: 'LinkButton' }
)

function LinkButton({ variant, color, className, ...otherProps }: ButtonProps) {
  const classes = useStyles()

  const overrideClassName =
    (color === 'primary' || color === 'secondary') && variant === 'contained'
      ? classes.override
      : undefined

  return (
    <Button
      {...otherProps}
      color={color}
      variant={variant}
      className={classNames(overrideClassName, className)}
    />
  )
}

export default withLinkButton<ButtonProps>(LinkButton)
