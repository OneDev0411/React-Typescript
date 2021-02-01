import { Model } from 'backbone'

import { Editor } from 'grapesjs'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../utils/get-template-render-data'

export const isComponent = (type: string) => (el: HTMLElement) =>
  el.dataset?.type === type

export const baseView = (blockClassNames: string | undefined) => ({
  init({ model }) {
    if (blockClassNames) {
      model.addClass(blockClassNames)
    }
  }
})

export function handleBlockDragStopEvent(
  editor: Editor,
  templates: Record<string, string>,
  renderData: TemplateRenderData
): void
export function handleBlockDragStopEvent<T>(
  editor: Editor,
  templates: Record<string, string>,
  renderData: TemplateRenderData | ((selectedItem: T) => TemplateRenderData),
  onDrop: (model: Model) => void
): { selectHandler: (selectedItem?: T) => void }
export function handleBlockDragStopEvent<T>(
  editor: Editor,
  templates: Record<string, string>,
  renderData: TemplateRenderData | ((selectedItem: T) => TemplateRenderData),
  onDrop?: (model: Model) => void
) {
  function appendBlock(model: any, renderData: TemplateRenderData) {
    const template = templates[model.attributes.attributes['data-block']]

    if (template) {
      const mjml = nunjucks.renderString(template, renderData)

      model.parent().append(mjml, { at: model.opt.at })
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
        typeof renderData === 'function' ? renderData(selectedItem) : renderData
      )
    } else {
      modelHandle.remove()
    }

    modelHandle = null

    return true
  }

  editor.on('block:drag:stop', (model: Model, block: any) => {
    if (!model || !templates[block.id]) {
      return
    }

    if (onDrop) {
      modelHandle = model
      onDrop(model)
    } else if (typeof renderData !== 'function') {
      appendBlock(model, renderData)
    }
  })

  return {
    selectHandler
  }
}
