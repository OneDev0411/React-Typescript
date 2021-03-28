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
import { TemplateBlocks } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

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

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlocks: TemplateBlocks
): void {
  const staticBlocks = {
    [headline1BlockName]:
      templateBlocks[headline1BlockName]?.template || Headline1,
    [headline2BlockName]:
      templateBlocks[headline2BlockName]?.template || Headline2,
    [column1ElementBlockName]:
      templateBlocks[column1ElementBlockName]?.template || Column1,
    [column2ElementBlockName]:
      templateBlocks[column2ElementBlockName]?.template || Column2,
    [column3ElementBlockName]:
      templateBlocks[column3ElementBlockName]?.template || Column3,
    [textElementBlockName]:
      templateBlocks[textElementBlockName]?.template || Text,
    [dividerBlockName]: templateBlocks[dividerBlockName]?.template || Divider,
    [spacerBlockName]: templateBlocks[spacerBlockName]?.template || Spacer,
    [buttonBlockName]: templateBlocks[buttonBlockName]?.template || Button,
    [socialGroupBlockName]:
      templateBlocks[socialGroupBlockName]?.template || SocialGroup
  }

  registerBlock(
    editor,
    {
      label: 'Headline 1',
      icon: Headline1Icon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: headline1BlockName,
      template: staticBlocks[headline1BlockName],
      adaptive: true
    },
    templateBlocks[headline1BlockName]
  )

  registerBlock(
    editor,
    {
      label: 'Headline 2',
      icon: Headline2Icon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: headline2BlockName,
      template: staticBlocks[headline2BlockName],
      adaptive: true
    },
    templateBlocks[headline2BlockName]
  )

  registerBlock(
    editor,
    {
      label: 'Button',
      icon: ButtonIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: buttonBlockName,
      template: staticBlocks[buttonBlockName],
      adaptive: true
    },
    templateBlocks[buttonBlockName]
  )

  registerBlock(
    editor,
    {
      label: 'Social Group',
      icon: ShareIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: socialGroupBlockName,
      template: staticBlocks[socialGroupBlockName],
      adaptive: true
    },
    templateBlocks[socialGroupBlockName]
  )

  registerBlock(
    editor,
    {
      label: '1 Column',
      icon: OneColIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: column1ElementBlockName,
      template: staticBlocks[column1ElementBlockName]
    },
    templateBlocks[column1ElementBlockName]
  )

  registerBlock(
    editor,
    {
      label: '2 Columns',
      icon: TwoColIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: column2ElementBlockName,
      template: staticBlocks[column2ElementBlockName]
    },
    templateBlocks[column2ElementBlockName]
  )

  registerBlock(
    editor,
    {
      label: '3 Columns',
      icon: ThreeColIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: column3ElementBlockName,
      template: staticBlocks[column3ElementBlockName]
    },
    templateBlocks[column3ElementBlockName]
  )

  registerBlock(
    editor,
    {
      label: 'Text',
      icon: TextIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: textElementBlockName,
      template: staticBlocks[textElementBlockName],
      adaptive: true
    },
    templateBlocks[textElementBlockName]
  )

  registerBlock(
    editor,
    {
      label: 'Divider',
      icon: DividerIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: dividerBlockName,
      template: staticBlocks[dividerBlockName],
      adaptive: true
    },
    templateBlocks[dividerBlockName]
  )

  registerBlock(
    editor,
    {
      label: 'Spacer',
      icon: SpacerIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: spacerBlockName,
      template: staticBlocks[spacerBlockName],
      adaptive: true
    },
    templateBlocks[spacerBlockName]
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Statics',
    staticBlocks,
    templateBlocks
  )

  handleBlockDragStopEvent(editor, adaptTemplates(allBlocks), renderData)
}
