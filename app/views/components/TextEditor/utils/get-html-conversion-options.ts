import { EditorState } from 'draft-js'
import { Options as ExportOptions } from 'draft-js-export-html'
import { Options as ImportOptions } from 'draft-js-import-html'

import {
  INLINE_ELEMENTS,
  SPECIAL_ELEMENTS
} from 'draft-js-import-element/lib/lib/Constants'

import { getAtomicBlockEntityData } from './get-atomic-block-entity-data'
import { signatureCustomBlockFn } from '../plugins/draft-js-signature-plugin'
import {
  iFrameCustomBlockFn,
  renderIFrame
} from '../plugins/draft-js-iframe-plugin'
import { composeFunctions } from './compose-functions'
import { blockStyleFn } from './block-style-fn'
import { renderImage } from './render-image'

interface HtmlConversionOptions {
  stateToHtmlOptions: ExportOptions
  stateFromHtmlOptions: ImportOptions
}

delete INLINE_ELEMENTS.iframe
delete SPECIAL_ELEMENTS.iframe

export function getHtmlConversionOptions(
  editor: EditorState | (() => EditorState | null)
): HtmlConversionOptions {
  const getEditorState = () =>
    typeof editor === 'function' ? editor() : editor

  return {
    stateToHtmlOptions: {
      blockStyleFn,
      blockRenderers: {
        atomic: composeFunctions(renderImage(getEditorState), renderIFrame)
      },
      defaultBlockTag: 'div'
    },
    stateFromHtmlOptions: {
      customBlockFn: composeFunctions(
        iFrameCustomBlockFn('rechat-quote'),
        signatureCustomBlockFn('rechat-signature')
      ),
      customInlineFn: (element, inlineCreators) => {
        if (element instanceof HTMLImageElement) {
          const data = getAtomicBlockEntityData(element)

          return inlineCreators.Entity('IMAGE', data)
        }

        return undefined
      }
    }
  }
}
