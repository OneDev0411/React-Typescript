import React from 'react'
import { ContentBlock, ContentState } from 'draft-js'

import { wrapDisplayName } from 'recompose'

import IconCircleSpinner from '../../../SvgIcons/CircleSpinner/IconCircleSpinner'
import { LoadingWrapper } from './styled'
import { getAlignmentStyles } from '../../utils/get-alignment-styles'

type Props = {
  block: ContentBlock
  blockProps: StringMap<any>
  contentState: ContentState
}

export const withUploadingIndicator = WrappedComponent => {
  return class WithUploadingIndicator extends React.Component<Props, any> {
    static displayName = wrapDisplayName(
      WrappedComponent,
      'WithUploadingIndicator'
    )

    render() {
      const style = this.props.blockProps.alignment
        ? getAlignmentStyles(this.props.blockProps.alignment)
        : {}

      const data = this.props.contentState
        .getEntity(this.props.block.getEntityAt(0))
        .getData()

      return (
        <LoadingWrapper uploading={data.uploading} style={style}>
          {data.uploading && <IconCircleSpinner />}
          <WrappedComponent {...this.props} />
        </LoadingWrapper>
      )
    }
  }
}
