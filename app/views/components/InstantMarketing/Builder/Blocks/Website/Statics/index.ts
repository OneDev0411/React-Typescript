import { Editor } from 'grapesjs'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../../utils/get-template-render-data'

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

export interface StaticBlockOptions
  extends HeadlineBlockOptions,
    TextBlockOptions,
    ButtonBlockOptions,
    GridBlockOptions,
    SocialGroupBlockOptions {}

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  blockOptions: StaticBlockOptions
): void {
  const templates = {
    ...loadHeadline(editor, blockOptions),
    ...loadText(editor, blockOptions),
    ...loadButton(editor, blockOptions),
    ...loadGrid(editor, blockOptions),
    ...loadSocialGroup(editor, blockOptions)
  }

  // registerBlock(editor, {
  //   label: 'Image/GIF',
  //   category: BASICS_BLOCK_CATEGORY,
  //   blockName: imageBlockName,
  //   template: templates[imageBlockName]
  // })

  // registerBlock(editor, {
  //   label: 'Video',
  //   category: BASICS_BLOCK_CATEGORY,
  //   blockName: videoBlockName,
  //   template: templates[videoBlockName]
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

  editor.on('block:drag:stop', (model: any, block: any) => {
    if (!model) {
      return
    }

    if (!templates[block.id]) {
      return
    }

    const parent = model.parent()

    const template = templates[model.attributes.attributes['data-block']]
    const njk = nunjucks.renderString(template, {
      ...renderData
    })

    parent.append(njk, { at: model.opt.at })
    model.remove()
  })
}
