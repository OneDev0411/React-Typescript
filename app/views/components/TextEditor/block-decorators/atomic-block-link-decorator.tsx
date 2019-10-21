import React from 'react'
import { wrapDisplayName } from 'recompose'
import { ContentBlock, ContentState } from 'draft-js'
import classNames from 'classnames'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

interface Props {
  block: ContentBlock
  blockProps: StringMap<any>
  contentState: ContentState
  className?: string
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {}
    }),
  { name: 'atomicBlockLinkDecorator' }
)

export const atomicBlockLinkDecorator = WrappedComponent => {
  function WithUploadingIndicator(props: Props) {
    const data = props.block.getData()
    const classes = useStyles()

    const href = data.get('href')

    const passedProps = href
      ? {
          ...props,
          title: data.get('title'),
          className: classNames(props.className, classes.root)
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
