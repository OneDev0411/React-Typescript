import { forwardRef, ComponentType, Ref } from 'react'

import { Link, LinkProps } from 'react-router'

export type LinkButtonProps = Partial<
  Pick<LinkProps, 'to' | 'target' | 'rel' | 'href'>
>

function withLinkButton<T>(Component: ComponentType<T>) {
  return forwardRef(function LinkButton(
    { to, ...other }: T & LinkButtonProps,
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
