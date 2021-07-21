import { Model } from 'backbone'
import { Editor } from 'grapesjs'

import ArticleImageLeftIcon from 'assets/images/marketing/editor/blocks/article-image-left.png'
import ArticleImageRightIcon from 'assets/images/marketing/editor/blocks/article-image-right.png'
import ArticleImageTopIcon from 'assets/images/marketing/editor/blocks/article-image-top.png'
import { Metadata } from 'components/ArticleDrawer/types'

import { ARTICLES_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'

import ArticleLeft from './templates/article-left.mjml'
import ArticleRight from './templates/article-right.mjml'
import ArticleTop from './templates/article-top.mjml'

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
