import { Editor } from 'grapesjs'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../utils/get-template-render-data/index'

import { ARTICLES_BLOCK_CATEGORY, BASICS_BLOCK_CATEGORY } from '../../constants'
import { BlockOptions } from '../types'

import ArticleTop from './article-top.mjml'
import ArticleDual from './article-dual.mjml'
import ArticleLeft from './article-left.mjml'
import ArticleRight from './article-right.mjml'
import Image from './image.mjml'
import Button from './button.mjml'
import GroupSocial from './group-social.mjml'
import GroupSocialElement from './group-social-element.mjml'

const articleTopBlockName = 'article-image-top'
const articleDualBlockName = 'article-image-dual'
const articleLeftBlockName = 'article-image-left'
const articleRightBlockName = 'article-image-right'
const imageBlockName = 'image'
const buttonBlockName = 'button'
const groupSocialBlockName = 'group-social'
const groupSocialElementBlockName = 'group-social-element'

const templates = {}

templates[articleTopBlockName] = ArticleTop
templates[articleDualBlockName] = ArticleDual
templates[articleLeftBlockName] = ArticleLeft
templates[articleRightBlockName] = ArticleRight

templates[imageBlockName] = Image
templates[buttonBlockName] = Button
templates[groupSocialBlockName] = GroupSocial
templates[groupSocialElementBlockName] = GroupSocialElement

function registerStaticBlock(
  editor: Editor,
  { label, category, blockName, attributes }: BlockOptions
): void {
  editor.BlockManager.add(blockName, {
    category,
    label,
    attributes,
    content: `<div data-block="${blockName}"></div>`
  })
}

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData
): void {
  registerStaticBlock(editor, {
    label: 'Image Top',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: articleTopBlockName
  })

  registerStaticBlock(editor, {
    label: 'Image Dual',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: articleDualBlockName
  })

  registerStaticBlock(editor, {
    label: 'Image Left',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: articleLeftBlockName
  })

  registerStaticBlock(editor, {
    label: 'Image Right',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: articleRightBlockName
  })

  registerStaticBlock(editor, {
    label: 'Image',
    category: BASICS_BLOCK_CATEGORY,
    blockName: imageBlockName,
    attributes: { class: 'fa fa-image' }
  })

  registerStaticBlock(editor, {
    label: 'Button',
    category: BASICS_BLOCK_CATEGORY,
    blockName: buttonBlockName,
    attributes: { class: 'block-button block-basic-button' }
  })

  registerStaticBlock(editor, {
    label: 'Group Social',
    category: BASICS_BLOCK_CATEGORY,
    blockName: groupSocialBlockName,
    attributes: { class: 'fa fa-share-alt' }
  })

  registerStaticBlock(editor, {
    label: 'Group Social Element',
    category: BASICS_BLOCK_CATEGORY,
    blockName: groupSocialElementBlockName,
    attributes: { class: 'fa fa-share-alt-square' }
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
