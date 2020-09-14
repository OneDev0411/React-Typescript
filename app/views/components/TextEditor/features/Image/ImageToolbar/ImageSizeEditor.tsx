import React from 'react'
import { FormControl, MenuItem, Select } from '@material-ui/core'
import { ContentBlock, EditorState } from 'draft-js'
import { findKey } from 'lodash'

import {
  getImageSizeOptions,
  ImageSizeOptions
} from '../utils/get-image-size-options'
import { getBlockElement } from '../../../utils/get-block-element'
import { updateAtomicBlockEntityData } from '../../../modifiers/update-atomic-block-entity-data'
import { getSelectedAtomicBlock } from '../../../utils/get-selected-atomic-block'
import { getAtomicBlockEntityData } from '../../../utils/get-atomic-block-entity-data'

interface Props {
  editorState: EditorState
  onChange: (editorState: EditorState) => void
  /**
   * By default, the currently selected atomic block will be used, but this can
   * override it.
   */
  block: ContentBlock | null
}

const sizes: Record<keyof ImageSizeOptions, string> = {
  small: 'Small',
  bestFit: 'Best Fit',
  original: 'Original'
}
export function ImageSizeEditor({ block, editorState, onChange }: Props) {
  const targetBlock = block || getSelectedAtomicBlock(editorState)
  const element = targetBlock && getBlockElement(targetBlock)

  const imageElement =
    element &&
    (element instanceof HTMLImageElement
      ? element
      : element.querySelector('img'))

  const currentSize = imageElement && {
    width: imageElement.width,
    height: imageElement.height
  }
  const imageSizes =
    imageElement &&
    getImageSizeOptions({
      width: imageElement.naturalWidth,
      height: imageElement.naturalHeight
    })

  const blockData =
    targetBlock &&
    getAtomicBlockEntityData(editorState.getCurrentContent(), targetBlock)

  const isSizeSelected = size =>
    currentSize && Math.abs(size.width - currentSize.width) < 3
  let value

  // There are cases that original size and best fit are equal.
  // In these cases we save the lastSelectedSize and use it here,
  // to ensure always the selected option is shown to the user.
  // Note that the user may resize the image manually after selecting
  // one of the sizing options and therefore we need to always check
  // if the lastSelectedSize is actually selected based on the current size.
  if (
    blockData &&
    blockData.lastSelectedSize &&
    imageSizes &&
    isSizeSelected(imageSizes[blockData.lastSelectedSize])
  ) {
    value = blockData.lastSelectedSize
  } else {
    // If size matches one of the size options, we set value to it. otherwise
    // an empty string
    value = (imageSizes && findKey(imageSizes, isSizeSelected)) || ''
  }

  const resize = (size: keyof ImageSizeOptions) => {
    if (imageSizes) {
      onChange(
        updateAtomicBlockEntityData(
          editorState,
          block!, // when imageElement is found, block is not null for sure
          { ...imageSizes[size], lastSelectedSize: size }
        )
      )
    }
  }

  return (
    <FormControl>
      <Select
        disableUnderline
        displayEmpty
        value={value}
        onChange={event => resize(event.target.value as keyof ImageSizeOptions)}
        renderValue={(value: string) => sizes[value] || 'Custom size'}
      >
        {Object.entries(sizes).map(([size, title], index) => (
          <MenuItem key={index} value={size} dense>
            {title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
