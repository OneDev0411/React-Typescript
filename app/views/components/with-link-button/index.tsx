import { forwardRef, ComponentType, Ref } from 'react'

import { ButtonBaseProps } from '@material-ui/core'
import { Link, LinkProps } from 'react-router'

export type WithLinkButtonProps = Partial<
  Pick<LinkProps, 'to' | 'target' | 'rel' | 'href' | 'className'>
>

export type MakeWithLinkButtonProps<T> = T & WithLinkButtonProps

function withLinkButton<T extends ButtonBaseProps>(
  Component: ComponentType<T>
) {
  return forwardRef(function LinkButton(
    { to, ...other }: MakeWithLinkButtonProps<T>,
    ref: Ref<unknown>
  ) {
    const moreProps = to
      ? {
          component: Link,
          to
        }
      : {}

    return <Component ref={ref} {...(other as T)} {...moreProps} />
  })
}

export default withLinkButton
