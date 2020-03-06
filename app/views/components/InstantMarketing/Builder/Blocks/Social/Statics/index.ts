import { Editor } from 'grapesjs'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import registerBlock from '../../registerBlock'

import Text from './text.html'

export const textBlockName = 'rechat-text'

const templates = {}

templates[textBlockName] = Text

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData
): void {
  registerBlock(editor, {
    label: 'Text',
    category: BASICS_BLOCK_CATEGORY,
    blockName: textBlockName,
    template: templates[textBlockName]
  })

  editor.on('block:drag:stop', (model: any, block: any) => {
    if (!model) {
      return
    }

    if (!templates[block.id]) {
      return
    }

    const template = templates[model.attributes.attributes['data-block']]

    const html = nunjucks.renderString(template, {
      ...renderData
    })

    model.parent().append(html, { at: model.opt.at })

    model.remove()
  })
}
