import PluginsEditor from 'draft-js-plugins-editor'
import { ContentBlock } from 'draft-js'

import { Options as ExportOptions } from 'draft-js-export-html'
import { Options as ImportOptions } from 'draft-js-import-html'

import { renderAtomicBlockStyles } from './render-atomic-block'
import { getAtomicBlockEntityData } from './get-atomic-block-entity-data'
import {
  signatureBlockStyleFn,
  signatureCustomBlockFn
} from '../plugins/draft-js-signature-plugin'

interface HtmlConversionOptions {
  stateToHtmlOptions: ExportOptions
  stateFromHtmlOptions: ImportOptions
}

export function getHtmlConversionOptions(
  editor: PluginsEditor | (() => PluginsEditor | null)
): HtmlConversionOptions {
  return {
    stateToHtmlOptions: {
      blockStyleFn: signatureBlockStyleFn('rechat-signature'),
      blockRenderers: {
        atomic: (block: ContentBlock) => {
          const entityKey = block.getEntityAt(0)

          const resolvedEditor =
            typeof editor === 'function' ? editor() : editor

          if (entityKey && resolvedEditor) {
            const entity = resolvedEditor
              .getEditorState()
              .getCurrentContent()
              .getEntity(entityKey)

            if (entity.getType().toLocaleLowerCase() === 'image') {
              const data = entity.getData()
              const style = renderAtomicBlockStyles(data)

              const img = `<img src="${data.src}" style="${style}" />`

              // TODO: move to blockStyleFn when MR!428 is merged
              return `<figure style="margin: 0">${img}</figure>`
            }
          }

          return undefined as any // typing is wrong, it should accept undefined too
        }
      },
      defaultBlockTag: 'div'
    },
    stateFromHtmlOptions: {
      customBlockFn: signatureCustomBlockFn('rechat-signature'),
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
