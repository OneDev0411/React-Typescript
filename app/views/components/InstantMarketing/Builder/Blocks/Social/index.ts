import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../utils/get-template-render-data'
import {
  reorderBlocksWithCustomLabels,
  collapseBlockCategories
} from '../Email/utils'

import registerStaticBlocks from './Statics'

export function registerSocialBlocks(
  editor: Editor,
  renderData: TemplateRenderData
) {
  registerStaticBlocks(editor, renderData)

  reorderBlocksWithCustomLabels(editor)
  collapseBlockCategories(editor)
}
