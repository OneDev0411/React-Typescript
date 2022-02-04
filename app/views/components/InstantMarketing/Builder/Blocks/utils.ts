import type { Editor, Model } from 'grapesjs'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../utils/get-template-render-data'

import adapt from './adapt'
import {
  BlockTemplates,
  TemplateRenderDataFunc,
  BlockOnDropFunc,
  RegisterBlockSelectHandler,
  TemplateBlockOptions
} from './types'

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

export function handleBlockDragStopEvent<TCustomRenderData = {}>(
  editor: Editor,
  templates: BlockTemplates,
  renderData: TemplateRenderData<TCustomRenderData>
): void

export function handleBlockDragStopEvent<TSelectedItem, TCustomRenderData = {}>(
  editor: Editor,
  templates: BlockTemplates,
  renderData:
    | TemplateRenderData<TCustomRenderData>
    | TemplateRenderDataFunc<TSelectedItem, TCustomRenderData>,
  onDrop: BlockOnDropFunc
): RegisterBlockSelectHandler<TSelectedItem>

export function handleBlockDragStopEvent<TSelectedItem, TCustomRenderData = {}>(
  editor: Editor,
  templates: BlockTemplates,
  renderData:
    | TemplateRenderData<TCustomRenderData>
    | TemplateRenderDataFunc<TSelectedItem, TCustomRenderData>,
  onDrop?: BlockOnDropFunc
): RegisterBlockSelectHandler<TSelectedItem> {
  function adaptTemplateIfNeeded(
    template: string,
    blockId: string,
    parent: Model | null = null
  ) {
    return parent &&
      template &&
      editor.BlockManager.get(blockId)?.attributes.adaptive
      ? adapt(parent, template)
      : template
  }

  function appendBlock(
    model: Model,
    renderData: TemplateRenderData<TCustomRenderData>
  ) {
    const parent = model.parent()

    if (!parent) {
      return
    }

    const blockId = model.attributes.attributes['data-block']
    const rawTemplate = templates[blockId]

    if (rawTemplate) {
      // To make sure the adapt logic works fine, we have to pass
      // the rendered template
      const html = adaptTemplateIfNeeded(
        nunjucks.renderString(rawTemplate, renderData),
        blockId,
        parent
      )

      parent.append(html, { at: model.opt.at })
    }

    model.remove()
  }

  function isRenderDataFunc(
    renderData
  ): renderData is TemplateRenderDataFunc<TSelectedItem, TCustomRenderData> {
    return typeof renderData === 'function'
  }

  let modelHandle: Nullable<Model> = null

  const selectHandler = (selectedItem?: TSelectedItem) => {
    if (!modelHandle) {
      return false
    }

    if (selectedItem) {
      appendBlock(
        modelHandle,
        // We have to use the type guard to avoid TS error. Because this expression does not
        // work: typeof renderData === 'function'
        isRenderDataFunc(renderData)
          ? renderData(
              selectedItem,
              modelHandle.attributes.attributes['data-block'] as string
            )
          : renderData
      )
    } else {
      modelHandle.remove()
    }

    modelHandle = null

    return true
  }

  editor.on('block:drag:stop', (model: Model, block: Model) => {
    if (!model || !templates[block.id]) {
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
      editor.BlockManager.add(blockName, block.clone())
    }
  })
}

export function isDefaultBlocksDisabled(
  templateBlockOptions: TemplateBlockOptions,
  category: string
) {
  return (
    templateBlockOptions.disableDefault === true ||
    templateBlockOptions.disableDefault?.includes(category)
  )
}
