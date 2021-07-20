import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../../utils/get-template-render-data'
import { TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'

import registerButtonBlock, {
  ButtonBlockOptions,
  buttonBlockTraits
} from './button'
import registerGridBlock, { GridBlockOptions } from './grid'
import registerHeadlineBlock, { HeadlineBlockOptions } from './headline'
import registerSocialGroupBlock, {
  SocialGroupBlockOptions,
  socialGroupBlockTraits
} from './social-group'
import registerTextBlock, { TextBlockOptions } from './text'

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
  templateBlockOptions: TemplateBlockOptions,
  blocksOptions: StaticBlocksOptions
): void {
  const templates = {
    ...registerHeadlineBlock(editor, templateBlockOptions, blocksOptions),
    ...registerTextBlock(editor, templateBlockOptions, blocksOptions),
    ...registerButtonBlock(editor, templateBlockOptions, blocksOptions),
    ...registerGridBlock(editor, templateBlockOptions, blocksOptions),
    ...registerSocialGroupBlock(editor, templateBlockOptions, blocksOptions)
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
