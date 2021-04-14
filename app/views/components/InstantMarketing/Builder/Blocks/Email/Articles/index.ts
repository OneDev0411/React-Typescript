import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import ArticleImageTopIcon from 'assets/images/marketing/editor/blocks/image-top.png'
import ArticleImageLeftIcon from 'assets/images/marketing/editor/blocks/image-left.png'
import ArticleImageRightIcon from 'assets/images/marketing/editor/blocks/image-right.png'

import { Metadata } from 'components/ArticleDrawer/types'

import registerBlock from '../../registerBlock'
import { ARTICLES_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import ArticleTop from './templates/article-top.mjml'
import ArticleLeft from './templates/article-left.mjml'
import ArticleRight from './templates/article-right.mjml'
import { handleBlockDragStopEvent } from '../../utils'
import { TemplateBlockOptions } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

export const articleTopBlockName = 'rechat-article-image-top'
export const articleLeftBlockName = 'rechat-article-image-left'
export const articleRightBlockName = 'rechat-article-image-right'

export interface Options {
  onDrop: (model: Model) => void
}

interface ArticleBlock {
  selectHandler: (selectedArticle?: Metadata) => void
}

export default function registerArticleBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { onDrop }: Options
): ArticleBlock {
  const articleBlocks = {
    [articleTopBlockName]:
      templateBlockOptions.blocks[articleTopBlockName]?.template || ArticleTop,
    [articleLeftBlockName]:
      templateBlockOptions.blocks[articleLeftBlockName]?.template ||
      ArticleLeft,
    [articleRightBlockName]:
      templateBlockOptions.blocks[articleRightBlockName]?.template ||
      ArticleRight
  }

  registerBlock(
    editor,
    {
      label: 'Image Top',
      icon: ArticleImageTopIcon,
      category: ARTICLES_BLOCK_CATEGORY,
      blockName: articleTopBlockName,
      template: articleBlocks[articleTopBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Image Left',
      icon: ArticleImageLeftIcon,
      category: ARTICLES_BLOCK_CATEGORY,
      blockName: articleLeftBlockName,
      template: articleBlocks[articleLeftBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Image Right',
      icon: ArticleImageRightIcon,
      category: ARTICLES_BLOCK_CATEGORY,
      blockName: articleRightBlockName,
      template: articleBlocks[articleRightBlockName]
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Articles',
    articleBlocks,
    templateBlockOptions.blocks
  )

  return handleBlockDragStopEvent(
    editor,
    allBlocks,
    (selectedArticle: Metadata) => ({
      ...renderData,
      description: selectedArticle?.description,
      image: selectedArticle?.image,
      title: selectedArticle?.title,
      url: selectedArticle?.url
    }),
    onDrop
  )
}
