import { FormControl, MenuItem, Select } from '@material-ui/core'
import React from 'react'
import { ContentBlock, EditorState } from 'draft-js'

import { findKey } from 'lodash'

import {
  getImageSizeOptions,
  ImageSizeOptions
} from '../../utils/get-image-size-options'
import { getBlockElement } from '../../utils/get-block-element'
import { updateAtomicBlockEntityData } from '../../modifiers/update-atomic-block-entity-data'
import { getSelectedAtomicBlock } from '../../utils/get-selected-atomic-block'

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

  const value =
    (currentSize &&
      imageSizes &&
      findKey(
        imageSizes,
        size => Math.abs(size.width - currentSize.width) < 3
      )) ||
    ''

  const resize = (size: keyof ImageSizeOptions) => {
    if (imageSizes) {
      onChange(
        updateAtomicBlockEntityData(
          editorState,
          block!, // when imageElement is found, block is not null for sure
          imageSizes[size]
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
