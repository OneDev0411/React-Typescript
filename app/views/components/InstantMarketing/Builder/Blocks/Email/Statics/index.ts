import { Editor } from 'grapesjs'

import Headline1Icon from 'assets/images/marketing/editor/blocks/h1.png'
import Headline2Icon from 'assets/images/marketing/editor/blocks/h2.png'
import OneColIcon from 'assets/images/marketing/editor/blocks/col-1.png'
import TwoColIcon from 'assets/images/marketing/editor/blocks/col-2.png'
import ThreeColIcon from 'assets/images/marketing/editor/blocks/col-3.png'
import TextIcon from 'assets/images/marketing/editor/blocks/text.png'
import DividerIcon from 'assets/images/marketing/editor/blocks/divider.png'
import SpacerIcon from 'assets/images/marketing/editor/blocks/spacer.png'
import ButtonIcon from 'assets/images/marketing/editor/blocks/button.png'
import ShareIcon from 'assets/images/marketing/editor/blocks/share.png'

import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import registerBlock from '../../registerBlock'

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
import { handleBlockDragStopEvent } from '../../utils'
import { adaptTemplates } from '../utils'

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
    icon: Headline1Icon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: headline1BlockName,
    template: templates[headline1BlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Headline 2',
    icon: Headline2Icon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: headline2BlockName,
    template: templates[headline2BlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Button',
    icon: ButtonIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: buttonBlockName,
    template: templates[buttonBlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Social Group',
    icon: ShareIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: socialGroupBlockName,
    template: templates[socialGroupBlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: '1 Column',
    icon: OneColIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: column1ElementBlockName,
    template: templates[column1ElementBlockName]
  })

  registerBlock(editor, {
    label: '2 Columns',
    icon: TwoColIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: column2ElementBlockName,
    template: templates[column2ElementBlockName]
  })

  registerBlock(editor, {
    label: '3 Columns',
    icon: ThreeColIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: column3ElementBlockName,
    template: templates[column3ElementBlockName]
  })

  registerBlock(editor, {
    label: 'Text',
    icon: TextIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: textElementBlockName,
    template: templates[textElementBlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Divider',
    icon: DividerIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: dividerBlockName,
    template: templates[dividerBlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Spacer',
    icon: SpacerIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: spacerBlockName,
    template: templates[spacerBlockName],
    adaptive: true
  })

  handleBlockDragStopEvent(editor, adaptTemplates(templates), renderData)
}
