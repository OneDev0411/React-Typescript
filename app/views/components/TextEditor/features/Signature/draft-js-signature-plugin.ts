import { ContentBlock, ContentState, EditorState } from 'draft-js'
import { PluginFunctions } from 'draft-js-plugins-editor'

import {
  CustomBlockFn,
  Options as ImportOptions,
  stateFromHTML
} from 'draft-js-import-html'

import { BlockStyleFn } from 'draft-js-export-html'

import { appendBlocks } from '../../utils/append-blocks'
import { isValidSelection } from '../../utils/is-valid-selection'

type SignatureContentType = ContentBlock[] | string

export type SignatureContentOption =
  | SignatureContentType
  | (() => SignatureContentType)

export interface CreateSignaturePluginOptions {
  /**
   * Content of the signature. It can be the content itself or a function which
   * returns the content. If the content is string, it's converted to block
   * array using stateFromHTML
   */
  signatureContent: SignatureContentOption
  /**
   * Weather to prepend the signature with a "--" separator line.
   */
  prependSignatureWithSeparator?: boolean

  numOfEmptyLinesBeforeSignature?: number

  stateFromHtmlOptions?: ImportOptions
}

/**
 * Creates a plugin which exposes these functions:
 *  - toggleSignature: adds/removes signature to/from the editor
 *  - hasSignature: indicates whether the editor currently contains the signature
 *
 * It also exposes appendSignature modifier
 *
 * @param signatureBlocks
 * @param prependSignatureWithSeparator
 */
export default function createSignaturePlugin({
  signatureContent,
  prependSignatureWithSeparator = true,
  numOfEmptyLinesBeforeSignature = 2,
  stateFromHtmlOptions
}: CreateSignaturePluginOptions) {
  let pluginFns: PluginFunctions

  /**
   * Returns weather signature exists in the editor or not.
   */
  const hasSignature = (editorState: EditorState) => {
    return editorState
      .getCurrentContent()
      .getBlocksAsArray()
      .some(isSignatureBlock)
  }

  /**
   * Toggles signature. If called with no argument, toggles. if a boolean
   * argument is passed, it enforces weather the signature should be shown
   * or not
   */
  const toggleSignature = (enabled?: boolean, focus = true) => {
    if (!pluginFns) {
      console.error(
        'toggleSignature cannot be called before editor initialization'
      )

      return
    }

    const editorState = pluginFns.getEditorState()

    if (!hasSignature(editorState) && enabled !== false) {
      // add signature
      pluginFns.setEditorState(appendSignature(editorState, focus))
    } else if (hasSignature(editorState) && enabled !== true) {
      // remove signature
      const blocks = editorState.getCurrentContent().getBlocksAsArray()
      const firstSignatureBlockIndex = blocks.findIndex(isSignatureBlock)
      const isEmptyBlockBeforeSignature = (index, block) =>
        index === firstSignatureBlockIndex - 1 && block.getText().trim() === ''

      const newBlocks = blocks.filter((block, index) => {
        return (
          !isSignatureBlock(block) && !isEmptyBlockBeforeSignature(index, block)
        )
      })

      const selection = editorState.getSelection()
      const newContent = ContentState.createFromBlockArray(
        newBlocks.length > 0
          ? newBlocks
          : ContentState.createFromText('').getBlocksAsArray()
      )

      const newEditorState = EditorState.push(
        editorState,
        newContent,
        'remove-range'
      )

      const newSelection = isValidSelection(newContent, selection)
        ? selection
        : EditorState.moveSelectionToEnd(newEditorState).getSelection()

      pluginFns.setEditorState(
        focus
          ? EditorState.forceSelection(newEditorState, newSelection)
          : EditorState.acceptSelection(newEditorState, newSelection)
      )
    }
  }
  const initialize = (fns: PluginFunctions) => {
    pluginFns = fns
  }

  const appendSignature = (editorState: EditorState, focus = false) => {
    const lastBlock = editorState
      .getCurrentContent()
      .getBlocksAsArray()
      .slice(-1)[0]

    const newEditorState = appendBlocks(editorState, [
      ...stateFromHTML(
        Array(
          Math.max(
            numOfEmptyLinesBeforeSignature -
              getNumberOfTrailingEmptyLines(lastBlock),
            0
          )
        )
          .fill(null)
          .map(() => '<br />')
          .join('')
      ).getBlocksAsArray(),
      ...(prependSignatureWithSeparator ? getSignatureSeparator() : []),
      ...getSignatureBlocks(signatureContent, stateFromHtmlOptions).map(
        convertToSignatureBlock
      )
    ])

    const selection = editorState.getSelection()

    if (focus) {
      return EditorState.forceSelection(newEditorState, selection)
    }

    return EditorState.acceptSelection(newEditorState, selection)
  }

  return {
    initialize,
    hasSignature: (editorState = pluginFns && pluginFns.getEditorState()) => {
      if (editorState) {
        return hasSignature(editorState)
      }

      return false
    },
    toggleSignature,
    modifiers: {
      appendSignature: (editorState: EditorState) => {
        if (!hasSignature(editorState)) {
          return appendSignature(editorState)
        }

        return editorState
      }
    }
  }
}

type SignatureBlockStyleFn = (className: string) => BlockStyleFn
type SignatureCustomBlockFn = (className: string) => CustomBlockFn

/**
 * A helper function to be used in stateToHtml options in order to
 * add a css class to signature blocks
 */
export const signatureBlockStyleFn: SignatureBlockStyleFn = (
  className = 'signature'
) => block => {
  if (block.getData().get('isSignature')) {
    return {
      attributes: {
        class: className
      }
    }
  }
}

export const signatureCustomBlockFn: SignatureCustomBlockFn = (
  className = 'signature'
) => (element: HTMLElement) => {
  if (element.classList.contains(className)) {
    return {
      data: {
        isSignature: true
      }
    }
  }
}

function getSignatureSeparator() {
  return stateFromHTML('<div>--</div>')
    .getBlocksAsArray()
    .map(convertToSignatureBlock)
}

function convertToSignatureBlock(block: ContentBlock) {
  return block.merge({
    data: block.getData().set('isSignature', true)
  }) as ContentBlock
}

function getSignatureBlocks(
  signatureContent: CreateSignaturePluginOptions['signatureContent'],
  stateFromHtmlOptions?: ImportOptions
): ContentBlock[] {
  const content =
    typeof signatureContent === 'function'
      ? signatureContent()
      : signatureContent

  return Array.isArray(content)
    ? content
    : stateFromHTML(content || '', stateFromHtmlOptions).getBlocksAsArray()
}

function isSignatureBlock(block: ContentBlock) {
  return block.getData().get('isSignature')
}

function getNumberOfTrailingEmptyLines(lastBlock) {
  return `a${lastBlock.getText()}`
    .split('')
    .reverse()
    .findIndex(char => char !== '\n')
}
