import { EditorState } from 'draft-js'
import { Options as ExportOptions } from 'draft-js-export-html'
import { Options as ImportOptions } from 'draft-js-import-html'
import {
  INLINE_ELEMENTS,
  SPECIAL_ELEMENTS
} from 'draft-js-import-element/lib/lib/Constants'
import { wrap } from 'lodash'

import { createAtomicBlockEntityData } from './create-atomic-block-entity-data'
import { signatureCustomBlockFn } from '../features/Signature/draft-js-signature-plugin'
import {
  iFrameCustomBlockFn,
  renderIFrame
} from '../plugins/draft-js-iframe-plugin'
import { combine } from './combine'
import { blockStyleFn } from './block-style-fn'
import { renderImage } from './render-image'
import { blockLevelLinkRendererWrapper } from './block-level-link-renderer-wrapper'
import { blockLevelLinkCustomBlockFn } from './block-level-link-custom-block-fn'
import { mergeFunctions } from './merge-functions'

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
        atomic: wrap(
          combine(renderImage(getEditorState), renderIFrame),
          blockLevelLinkRendererWrapper
        )
      },
      defaultBlockTag: 'div'
    },
    stateFromHtmlOptions: {
      customBlockFn: mergeFunctions(
        iFrameCustomBlockFn('rechat-quote'),
        signatureCustomBlockFn('rechat-signature'),
        blockLevelLinkCustomBlockFn
      ),
      customInlineFn: (element, inlineCreators) => {
        if (element instanceof HTMLImageElement) {
          const data = createAtomicBlockEntityData(element)

          return inlineCreators.Entity('IMAGE', data)
        }

        return undefined
      }
    }
  }
}
