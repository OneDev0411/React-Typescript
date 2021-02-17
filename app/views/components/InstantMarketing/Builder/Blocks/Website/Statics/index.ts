import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../../utils/get-template-render-data'
import { handleBlockDragStopEvent } from '../utils'

import loadButton, { ButtonBlockOptions, buttonBlockTraits } from './button'
import loadGrid, { GridBlockOptions } from './grid'
import loadText, { TextBlockOptions } from './text'
import loadHeadline, { HeadlineBlockOptions } from './headline'
import loadSocialGroup, {
  SocialGroupBlockOptions,
  socialGroupBlockTraits
} from './social-group'

export const staticBlocksTraits = {
  ...socialGroupBlockTraits,
  ...buttonBlockTraits
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

  handleBlockDragStopEvent(editor, templates, renderData)
}

export { buttonBlockName } from './button'

export {
  gridColumn1BlockName,
  gridColumn2BlockName,
  gridColumn3BlockName
} from './grid'

export { textBlockName } from './text'

export { headline1BlockName, headline2BlockName } from './headline'

export { socialGroupBlockName } from './social-group'
