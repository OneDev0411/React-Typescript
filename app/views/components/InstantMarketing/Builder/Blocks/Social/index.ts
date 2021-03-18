import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../utils/get-template-render-data'
import { TemplateBlocks } from '../types'
import { collapseBlockCategories } from '../utils'

import registerStaticBlocks from './Statics'

export function registerSocialBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlocks: TemplateBlocks
) {
  registerStaticBlocks(editor, renderData, templateBlocks)

  collapseBlockCategories(editor)
}
