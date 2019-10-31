import React from 'react'
import { wrapDisplayName } from 'recompose'

import { useRerenderOnChange } from 'hooks/use-rerender-on-change'

import { DraftPluginEditorDecoratorProps } from '../types'

/**
 *
 * ## Why?
 * Resize plugin keeps a local state of the block size and it doesn't
 * react to external changes of the resize data to update it's local state
 * So we need to cause an unmount/mount it whenever the resize data is changed
 * to prevent this issue.
 *
 * ## What happens if this decorator is not added:
 * Without this decorator, if resizing with size options
 * ("Small", "Best fit", ...) happens after a manual resize, it doesn't work.
 * Because manual resize will set the state of resizable wrapper component.
 * Note that even without this decorator, resizing with size options work
 * if the block (image) is not manually resized yet (and thus the size state
 * is not set yet within the resizable wrapper component)
 * @param WrappedComponent
 */
export const resizableBugFixDecorator = WrappedComponent => {
  function ResizableBugFix(props: DraftPluginEditorDecoratorProps) {
    const resizeData = props.blockProps.resizeData

    const rerender = useRerenderOnChange(resizeData)

    return rerender && <WrappedComponent {...props} />
  }

  ResizableBugFix.displayName = wrapDisplayName(
    WrappedComponent,
    'resizableBugFix'
  )

  return ResizableBugFix
}
