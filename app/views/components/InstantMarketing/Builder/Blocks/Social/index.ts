import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../utils/get-template-render-data'
import { TemplateBlockOptions } from '../types'
import { collapseBlockCategories } from '../utils'

import registerStaticBlocks from './Statics'

export function registerSocialBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions
) {
  registerStaticBlocks(editor, renderData, templateBlockOptions)

  collapseBlockCategories(editor)
}
