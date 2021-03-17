import type { Model } from 'backbone'

import type { Editor } from 'grapesjs'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../utils/get-template-render-data'

export function collapseBlockCategories(editor: Editor) {
  const categories = editor.BlockManager.getCategories() as any

  categories.each((category: any) => {
    category.set('open', false).on('change:open', (opened: any) => {
      opened.get('open') &&
        categories.each((category: any) => {
          category !== opened && category.set('open', false)
        })
    })
  })
}

export function handleBlockDragStopEvent(
  editor: Editor,
  templates:
    | Record<string, string>
    | ((parent: HTMLElement | null) => Record<string, string>),
  renderData: TemplateRenderData
): void
export function handleBlockDragStopEvent<T>(
  editor: Editor,
  templates:
    | Record<string, string>
    | ((parent: HTMLElement | null) => Record<string, string>),
  renderData:
    | TemplateRenderData
    | ((selectedItem: T, blockId: string) => TemplateRenderData),
  onDrop: (model: Model, blockId: string) => void
): { selectHandler: (selectedItem?: T) => void }
export function handleBlockDragStopEvent<T>(
  editor: Editor,
  templates:
    | Record<string, string>
    | ((parent: HTMLElement | null) => Record<string, string>),
  renderData:
    | TemplateRenderData
    | ((selectedItem: T, blockId: string) => TemplateRenderData),
  onDrop?: (model: Model, blockId: string) => void
) {
  function getTemplate(blockId: string, parent: HTMLElement | null = null) {
    return typeof templates === 'function'
      ? templates(parent)[blockId]
      : templates[blockId]
  }

  function appendBlock(model: any, renderData: TemplateRenderData) {
    const parent = model.parent()
    const template = getTemplate(
      model.attributes.attributes['data-block'],
      parent
    )

    if (template) {
      const html = nunjucks.renderString(template, renderData)

      parent.append(html, { at: model.opt.at })
    }

    model.remove()
  }

  let modelHandle: any

  const selectHandler = (selectedItem?: T) => {
    if (!modelHandle) {
      return false
    }

    if (selectedItem) {
      appendBlock(
        modelHandle,
        typeof renderData === 'function'
          ? renderData(
              selectedItem,
              modelHandle.attributes.attributes['data-block']
            )
          : renderData
      )
    } else {
      modelHandle.remove()
    }

    modelHandle = null

    return true
  }

  editor.on('block:drag:stop', (model: Model, block: any) => {
    if (!model || !getTemplate(block.id)) {
      return
    }

    if (onDrop) {
      modelHandle = model
      onDrop(model, block.id)
    } else if (typeof renderData !== 'function') {
      appendBlock(model, renderData)
    }
  })

  return {
    selectHandler
  }
}

export function reorderBlocks(editor: Editor, blockNames: string[]) {
  blockNames.forEach(blockName => {
    const block = editor.BlockManager.get(blockName)

    if (block) {
      editor.BlockManager.remove(blockName)
      editor.BlockManager.add(blockName, block.clone() as any)
    }
  })
}
