import { forwardRef, ComponentType, Ref } from 'react'
import classNames from 'classnames'

import { Link, LinkProps } from 'react-router'

import { makeStyles, ButtonProps } from '@material-ui/core'

const useStyles = makeStyles(
  {
    // TODO: remove this when the bootstrap styles got removed
    override: {
      '&:hover, &:focus': { color: 'white' }
    }
  },
  { name: 'LinkButton' }
)

export type LinkButtonProps = Partial<
  Pick<LinkProps, 'to' | 'target' | 'rel' | 'href' | 'className'>
>

// TODO: There is a CSS conflict with bootstrap styles. This logic
// tries to override the button color to overcome the problem.
// Please remove this when the bootstrap style get removed
type ButtonBaseProps = Pick<ButtonProps, 'color' | 'variant'>

function withLinkButton<T extends ButtonBaseProps>(
  Component: ComponentType<T>
) {
  return forwardRef(function LinkButton(
    { to, className, color, variant, ...other }: T & LinkButtonProps,
    ref: Ref<unknown>
  ) {
    const classes = useStyles()

    const moreProps = to
      ? {
          component: Link,
          to
        }
      : {}

    const overrideClassName =
      (color === 'primary' || color === 'secondary') && variant === 'contained'
        ? classes.override
        : undefined

    return (
      <Component
        ref={ref}
        {...(other as T)}
        {...moreProps}
        color={color}
        variant={variant}
        className={classNames(overrideClassName, className)}
      />
    )
  })
}

export default withLinkButton
