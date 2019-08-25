import { ContentBlock, EditorState } from 'draft-js'
import { Options as ExportOptions } from 'draft-js-export-html'
import { Options as ImportOptions } from 'draft-js-import-html'

import { renderAtomicBlockStyles } from './render-atomic-block'
import { getAtomicBlockEntityData } from './get-atomic-block-entity-data'
import {
  signatureBlockStyleFn,
  signatureCustomBlockFn
} from '../plugins/draft-js-signature-plugin'
import { stylesToString } from './styles-to-string'

interface HtmlConversionOptions {
  stateToHtmlOptions: ExportOptions
  stateFromHtmlOptions: ImportOptions
}

const blockStyleFn = signatureBlockStyleFn('rechat-signature')

export function getHtmlConversionOptions(
  editor: EditorState | (() => EditorState | null)
): HtmlConversionOptions {
  return {
    stateToHtmlOptions: {
      blockStyleFn,
      blockRenderers: {
        atomic: (block: ContentBlock) => {
          const entityKey = block.getEntityAt(0)

          const resolvedEditorState =
            typeof editor === 'function' ? editor() : editor

          if (entityKey && resolvedEditorState) {
            const entity = resolvedEditorState
              .getCurrentContent()
              .getEntity(entityKey)

            if (entity.getType().toLocaleLowerCase() === 'image') {
              const data = entity.getData()
              const atomicStyles = renderAtomicBlockStyles(data)

              const img = `<img src="${data.src}" style="${atomicStyles}" />`

              const { attributes = {}, style = {} } = blockStyleFn(block) || {}

              const styleString = stylesToString({ margin: 0, ...style })

              const attrsString = renderAttributes(attributes)

              return `<figure style="${styleString}" ${attrsString}>${img}</figure>`
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

const renderAttributes = (attrs: StringMap<string>) =>
  Object.entries(attrs)
    .map(([name, value]) => renderAttribute(name, value))
    .join(' ')
const renderAttribute = (name: string, value: string) => `${name}="${value}"`
