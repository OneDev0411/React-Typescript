import { forwardRef, ComponentType, Ref } from 'react'
import classNames from 'classnames'

import { Link, LinkProps } from 'react-router'

import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  {
    root: {
      // TODO: remove this when the bootstrap styles got removed
      '&:hover, &:focus': { color: 'white' }
    }
  },
  { name: 'LinkButton' }
)

export type LinkButtonProps = Partial<
  Pick<LinkProps, 'to' | 'target' | 'rel' | 'href' | 'className'>
>

function withLinkButton<T>(Component: ComponentType<T>) {
  return forwardRef(function LinkButton(
    { to, className, ...other }: T & LinkButtonProps,
    ref: Ref<unknown>
  ) {
    const classes = useStyles()

    const moreProps = to
      ? {
          component: Link,
          to
        }
      : {}

    return (
      <Component
        ref={ref}
        {...(other as T)}
        {...moreProps}
        className={classNames(classes.root, className)}
      />
    )
  })
}

export default withLinkButton
