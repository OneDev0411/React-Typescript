import React from 'react'
import { wrapDisplayName } from 'recompose'

import { DraftPluginEditorBlockDecoratorProps } from '../types'

export const atomicBlockLinkDecorator = WrappedComponent => {
  function AtomicBlockLink(props: DraftPluginEditorBlockDecoratorProps) {
    const data = props.block.getData()

    const href = data.get('href')

    const passedProps = href
      ? {
          ...props,
          title: data.get('title')
        }
      : props

    return <WrappedComponent {...passedProps} />
  }

  AtomicBlockLink.displayName = wrapDisplayName(
    WrappedComponent,
    'atomicBlockLink'
  )

  return AtomicBlockLink
}
