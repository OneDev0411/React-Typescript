import React from 'react'
import { ContentBlock, ContentState } from 'draft-js'
import { wrapDisplayName } from 'recompose'
import classNames from 'classnames'

import IconCircleSpinner from '../../../SvgIcons/CircleSpinner/IconCircleSpinner'
import { LoadingWrapper } from './styled'
import { getAlignmentStyles } from '../../utils/get-alignment-styles'
import { getSizeStyles } from '../../utils/get-size-styles'

interface Props {
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

      // This is required only for resize handles only in case of center
      // alignment.
      if (style.display === 'block') {
        Object.assign(style, getSizeStyles(data.width, data.height))
      }

      return (
        <LoadingWrapper
          uploading={data.uploading}
          style={style}
          // `focused` class is added to loading wrapper because resize of
          // handles which are based on css :before and :after pseudo classes.
          // These pseudo classes doesn't work on img elements and therefore
          // are applied to this wrapper span. If we implement our own resizable
          // plugin and replace it with current resizable plugin which
          // doesn't have resize handles and some features, we can remove these
          // kind of temporary solutions
          className={classNames({ focused: this.props.blockProps.isFocused })}
        >
          {data.uploading && <IconCircleSpinner />}
          <WrappedComponent {...this.props} />
        </LoadingWrapper>
      )
    }
  }
}
