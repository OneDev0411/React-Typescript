import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../../utils/get-template-render-data'
import { handleBlockDragStopEvent } from '../../utils'

import registerButtonBlock, {
  ButtonBlockOptions,
  buttonBlockTraits
} from './button'
import registerGridBlock, { GridBlockOptions } from './grid'
import registerTextBlock, { TextBlockOptions } from './text'
import registerHeadlineBlock, { HeadlineBlockOptions } from './headline'
import registerSocialGroupBlock, {
  SocialGroupBlockOptions,
  socialGroupBlockTraits
} from './social-group'
import { TemplateBlocks } from '../../types'

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
  templateBlocks: TemplateBlocks,
  blocksOptions: StaticBlocksOptions
): void {
  const templates = {
    ...registerHeadlineBlock(editor, templateBlocks, blocksOptions),
    ...registerTextBlock(editor, templateBlocks, blocksOptions),
    ...registerButtonBlock(editor, templateBlocks, blocksOptions),
    ...registerGridBlock(editor, templateBlocks, blocksOptions),
    ...registerSocialGroupBlock(editor, templateBlocks, blocksOptions)
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
