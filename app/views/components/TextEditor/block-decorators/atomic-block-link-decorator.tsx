import React from 'react'
import { wrapDisplayName } from 'recompose'
import { ContentBlock, ContentState } from 'draft-js'

interface Props {
  block: ContentBlock
  blockProps: StringMap<any>
  contentState: ContentState
  className?: string
}

export const atomicBlockLinkDecorator = WrappedComponent => {
  function WithUploadingIndicator(props: Props) {
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

  WithUploadingIndicator.displayName = wrapDisplayName(
    WrappedComponent,
    'atomicBlockLink'
  )

  return WithUploadingIndicator
}
