import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../../utils/get-template-render-data'
import { handleBlockDragStopEvent } from '../utils'

import loadButton, { ButtonBlockOptions } from './button'
import loadGrid, { GridBlockOptions } from './grid'
import loadText, { TextBlockOptions } from './text'
import loadHeadline, { HeadlineBlockOptions } from './headline'
import loadSocialGroup, {
  SocialGroupBlockOptions,
  socialGroupBlockTraits
} from './social-group'

export const staticBlocksTraits = {
  ...socialGroupBlockTraits
}

export interface StaticBlocksOptions
  extends HeadlineBlockOptions,
    TextBlockOptions,
    ButtonBlockOptions,
    GridBlockOptions,
    SocialGroupBlockOptions {}

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  blocksOptions: StaticBlocksOptions
): void {
  const templates = {
    ...loadHeadline(editor, blocksOptions),
    ...loadText(editor, blocksOptions),
    ...loadButton(editor, blocksOptions),
    ...loadGrid(editor, blocksOptions),
    ...loadSocialGroup(editor, blocksOptions)
  }

  // registerBlock(editor, {
  //   label: 'Image/GIF',
  //   category: BASICS_BLOCK_CATEGORY,
  //   blockName: imageBlockName,
  //   template: templates[imageBlockName]
  // })

  // registerBlock(editor, {
  //   label: 'Divider',
  //   category: BASICS_BLOCK_CATEGORY,
  //   blockName: dividerBlockName,
  //   template: templates[dividerBlockName]
  // })

  // registerBlock(editor, {
  //   label: 'Spacer',
  //   category: BASICS_BLOCK_CATEGORY,
  //   blockName: spacerBlockName,
  //   template: templates[spacerBlockName]
  // })

  handleBlockDragStopEvent(editor, templates, renderData)
}
