import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { NeighborhoodsReport } from 'components/NeighborhoodsReportDrawer/types'

import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import adapt from '../../adapt'
import { MARKET_REPORTS_CATEGORY } from '../../../constants'

import template from './template.mjml'

export const blockName = 'rechat-neighborhoods'

export interface Options {
  onDrop: (model: Model) => void
}

interface NeighborhoodsBlock {
  selectHandler: (selectedReport?: NeighborhoodsReport) => void
}

export default function registerNeighborhoodsBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  { onDrop }: Options
): NeighborhoodsBlock {
  registerBlock(editor, {
    label: 'Neighborhoods',
    category: MARKET_REPORTS_CATEGORY,
    blockName,
    template,
    adaptive: true
  })

  let modelHandle: any

  const selectHandler = (selectedReport?: NeighborhoodsReport) => {
    if (!modelHandle) {
      return
    }

    const parent = modelHandle.parent()

    if (selectedReport) {
      const mjml = nunjucks.renderString(adapt(parent, template), {
        ...renderData,
        report: selectedReport
      })

      parent.append(mjml, { at: modelHandle.opt.at })
    }

    modelHandle.remove()
  }

  editor.on('block:drag:stop', (model: Model, block: any) => {
    if (!model) {
      return
    }

    if (block.id === blockName) {
      modelHandle = model
      onDrop(model)
    }
  })

  return {
    selectHandler
  }
}
