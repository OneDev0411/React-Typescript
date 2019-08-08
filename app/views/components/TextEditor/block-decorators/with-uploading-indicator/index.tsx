import React from 'react'
import { ContentBlock, ContentState } from 'draft-js'

import { wrapDisplayName } from 'recompose'

import IconCircleSpinner from '../../../SvgIcons/CircleSpinner/IconCircleSpinner'
import { LoadingWrapper } from './styled'

type Props = {
  block: ContentBlock
  contentState: ContentState
}

export const withUploadingIndicator = WrappedComponent => {
  return class WithUploadingIndicator extends React.Component<Props, any> {
    static displayName = wrapDisplayName(
      WrappedComponent,
      'WithUploadingIndicator'
    )

    render() {
      const data = this.props.contentState
        .getEntity(this.props.block.getEntityAt(0))
        .getData()

      return (
        <LoadingWrapper uploading={data.uploading}>
          {data.uploading && <IconCircleSpinner />}
          <WrappedComponent {...this.props} />
        </LoadingWrapper>
      )
    }
  }
}
