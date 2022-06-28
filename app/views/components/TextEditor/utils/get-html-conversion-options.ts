import { EditorState } from 'draft-js'
import { Options as ExportOptions } from 'draft-js-export-html'
import {
  INLINE_ELEMENTS,
  SPECIAL_ELEMENTS
} from 'draft-js-import-element/lib/lib/Constants'
import { Options as ImportOptions } from 'draft-js-import-html'
import { wrap } from 'lodash'

import { TABLE_WRAPPER_CLASS_NAME } from '../config'
import { signatureCustomBlockFn } from '../features/Signature/draft-js-signature-plugin'
import {
  iFrameCustomBlockFn,
  renderIFrame
} from '../plugins/draft-js-iframe-plugin'
import {
  tableCustomBlockFn,
  renderTable
} from '../plugins/draft-js-table-plugin'

import { blockLevelLinkCustomBlockFn } from './block-level-link-custom-block-fn'
import { blockLevelLinkRendererWrapper } from './block-level-link-renderer-wrapper'
import { blockStyleFn } from './block-style-fn'
import { combine } from './combine'
import { createAtomicBlockEntityData } from './create-atomic-block-entity-data'
import { mergeFunctions } from './merge-functions'
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
        atomic: wrap(
          combine(renderImage(getEditorState), renderIFrame, renderTable),
          blockLevelLinkRendererWrapper
        )
      },
      defaultBlockTag: 'div'
    },
    stateFromHtmlOptions: {
      customBlockFn: mergeFunctions(
        tableCustomBlockFn(TABLE_WRAPPER_CLASS_NAME),
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
