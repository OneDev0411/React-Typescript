import { Editor } from 'grapesjs'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import registerBlock from '../../registerBlock'
import adapt from '../../adapt'

import Headline1 from './headline-1.mjml'
import Headline2 from './headline-2.mjml'
import Column1 from './column-1.mjml'
import Column2 from './column-2.mjml'
import Column3 from './column-3.mjml'
import Button from './button.mjml'
import Text from './text.mjml'
import Divider from './divider.mjml'
import Spacer from './spacer.mjml'
import SocialGroup from './social-group.mjml'

export const headline1BlockName = 'headline-1'
export const headline2BlockName = 'headline-2'
export const column1ElementBlockName = 'column-1'
export const column2ElementBlockName = 'column-2'
export const column3ElementBlockName = 'column-3'
export const textElementBlockName = 'text'
export const dividerBlockName = 'divider'
export const spacerBlockName = 'spacer'
export const buttonBlockName = 'mj-button'
export const socialGroupBlockName = 'mj-social-group'

const templates = {}

templates[headline1BlockName] = Headline1
templates[headline2BlockName] = Headline2

templates[column1ElementBlockName] = Column1
templates[column2ElementBlockName] = Column2
templates[column3ElementBlockName] = Column3

templates[textElementBlockName] = Text
templates[dividerBlockName] = Divider
templates[spacerBlockName] = Spacer

templates[buttonBlockName] = Button
templates[socialGroupBlockName] = SocialGroup

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData
): void {
  registerBlock(editor, {
    label: 'Headline 1',
    category: BASICS_BLOCK_CATEGORY,
    blockName: headline1BlockName,
    template: templates[headline1BlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Headline 2',
    category: BASICS_BLOCK_CATEGORY,
    blockName: headline2BlockName,
    template: templates[headline2BlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Button',
    category: BASICS_BLOCK_CATEGORY,
    blockName: buttonBlockName,
    template: templates[buttonBlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Social Group',
    category: BASICS_BLOCK_CATEGORY,
    blockName: socialGroupBlockName,
    template: templates[socialGroupBlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: '1 Column',
    category: BASICS_BLOCK_CATEGORY,
    blockName: column1ElementBlockName,
    template: templates[column1ElementBlockName]
  })

  registerBlock(editor, {
    label: '2 Columns',
    category: BASICS_BLOCK_CATEGORY,
    blockName: column2ElementBlockName,
    template: templates[column2ElementBlockName]
  })

  registerBlock(editor, {
    label: '3 Columns',
    category: BASICS_BLOCK_CATEGORY,
    blockName: column3ElementBlockName,
    template: templates[column3ElementBlockName]
  })

  registerBlock(editor, {
    label: 'Text',
    category: BASICS_BLOCK_CATEGORY,
    blockName: textElementBlockName,
    template: templates[textElementBlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Divider',
    category: BASICS_BLOCK_CATEGORY,
    blockName: dividerBlockName,
    template: templates[dividerBlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Spacer',
    category: BASICS_BLOCK_CATEGORY,
    blockName: spacerBlockName,
    template: templates[spacerBlockName],
    adaptive: true
  })

  editor.on('block:drag:stop', (model: any, block: any) => {
    if (!model) {
      return
    }

    if (!templates[block.id]) {
      return
    }

    const parent = model.parent()

    const template = templates[model.attributes.attributes['data-block']]
    const adapted = adapt(parent, template)

    const mjml = nunjucks.renderString(adapted, {
      ...renderData
    })

    parent.append(mjml, { at: model.opt.at })

    model.remove()
  })
}
