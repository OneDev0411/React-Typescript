import isEmail from 'validator/lib/isEmail'
import { EditorState } from 'draft-js'
import { getSelectionEntity, getSelectionText } from 'draftjs-utils'

import { getSelectedAtomicBlock } from '../../../utils/get-selected-atomic-block'

export function getCurrentLinkUrl(
  editorState: EditorState
): string | undefined {
  const entityKey = getSelectionEntity(editorState)

  const entity =
    entityKey && editorState.getCurrentContent().getEntity(entityKey)

  if (entity && entity.getType() === 'LINK') {
    return entity.getData().url
  }

  const selectedBlock = getSelectedAtomicBlock(editorState)

  if (selectedBlock) {
    return selectedBlock.getData().get('href')
  }
}

export function getCurrentLinkText(
  editorState: EditorState
): string | undefined {
  const selectedBlock = getSelectedAtomicBlock(editorState)

  if (selectedBlock) {
    return selectedBlock.getData().get('title')
  }

  return getSelectionText(editorState)
}

export const getSelectionAnchorElement = () => {
  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0) {
    return null
  }

  let node: Node | null = selection.getRangeAt(0).startContainer

  do {
    if (
      node &&
      node instanceof Element &&
      node.hasAttribute('data-offset-key')
    ) {
      return node
    }

    node = node.parentNode
  } while (node != null)

  return null
}

export function normalizeUrl(url) {
  if (url.match(/^http(s)?:\/\//)) {
    return url
  }

  if (isEmail(url)) {
    return `mailto:${url}`
  }

  return `http://${url}`
}
export const stopPropagation = event => event.stopPropagation()
