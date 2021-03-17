import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../utils/get-template-render-data'
import { collapseBlockCategories } from '../utils'

import registerStaticBlocks from './Statics'

export function registerSocialBlocks(
  editor: Editor,
  renderData: TemplateRenderData
) {
  registerStaticBlocks(editor, renderData)

  collapseBlockCategories(editor)
}
