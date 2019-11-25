import { Editor } from 'grapesjs'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../../utils/get-template-render-data/index'

import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import registerBlock from '../../registerBlock'

import Headline1 from './headline-1.mjml'
import Headline2 from './headline-2.mjml'
import Image from './image.mjml'
import Button from './button.mjml'
import SocialGroup from './social-group.mjml'
import SocialGroupElement from './social-group-element.mjml'

export const headline1BlockName = 'headline-1'
export const headline2BlockName = 'headline-2'
export const imageBlockName = 'mj-image'
export const buttonBlockName = 'mj-button'
export const socialGroupBlockName = 'mj-social-group'
export const socialGroupElementBlockName = 'mj-social-element'

const templates = {}

templates[headline1BlockName] = Headline1
templates[headline2BlockName] = Headline2

templates[imageBlockName] = Image
templates[buttonBlockName] = Button
templates[socialGroupBlockName] = SocialGroup
templates[socialGroupElementBlockName] = SocialGroupElement

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData
): void {
  registerBlock(editor, {
    label: 'Headline 1',
    category: BASICS_BLOCK_CATEGORY,
    blockName: headline1BlockName,
    template: templates[headline1BlockName]
  })

  registerBlock(editor, {
    label: 'Headline 2',
    category: BASICS_BLOCK_CATEGORY,
    blockName: headline2BlockName,
    template: templates[headline2BlockName]
  })

  registerBlock(editor, {
    label: 'Upload Image',
    category: BASICS_BLOCK_CATEGORY,
    blockName: imageBlockName,
    template: templates[imageBlockName]
  })

  registerBlock(editor, {
    label: 'Button',
    category: BASICS_BLOCK_CATEGORY,
    blockName: buttonBlockName,
    template: templates[buttonBlockName]
  })

  registerBlock(editor, {
    label: 'Social Group',
    category: BASICS_BLOCK_CATEGORY,
    blockName: socialGroupBlockName,
    template: templates[socialGroupBlockName]
  })

  registerBlock(editor, {
    label: 'Social Group Element',
    category: BASICS_BLOCK_CATEGORY,
    blockName: socialGroupElementBlockName,
    template: templates[socialGroupElementBlockName]
  })

  editor.on('block:drag:stop', (model: any, block: any) => {
    if (!model) {
      return
    }

    if (!templates[block.id]) {
      return
    }

    const template = templates[model.attributes.attributes['data-block']]

    const mjml = nunjucks.renderString(template, {
      ...renderData
    })

    model.parent().append(mjml, { at: model.opt.at })

    model.remove()
  })
}
