import { Model } from 'backbone'
import { Editor } from 'grapesjs'

import { ArticleMetadata } from '@app/views/components/SearchArticleDrawer/types'
import ArticleLeftIcon from 'assets/images/marketing/editor/blocks/article-image-left.png'
import ArticleRightIcon from 'assets/images/marketing/editor/blocks/article-image-right.png'
import ArticleTopIcon from 'assets/images/marketing/editor/blocks/article-image-top.png'

import { ARTICLES_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { TemplateBlockOptions, RegisterBlockSelectHandler } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'
import { baseView, isComponent } from '../utils'

import ArticleLeft from './article-left.njk'
import ArticleRight from './article-right.njk'
import ArticleTop from './article-top.njk'

const typeArticle = 'article'

export const articleTopBlockName = `${typeArticle}-top`
export const articleLeftBlockName = `${typeArticle}-left`
export const articleRightBlockName = `${typeArticle}-right`

interface ArticleRenderData {
  articles: ArticleMetadata[]
}

export interface ArticleBlocksOptions {
  articleClassNames?: string
  onArticleDrop: (model: Model) => void
}

export default function registerArticleBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { articleClassNames, onArticleDrop }: ArticleBlocksOptions
): RegisterBlockSelectHandler<ArticleMetadata[]> {
  editor.DomComponents.addType(typeArticle, {
    isComponent: isComponent(typeArticle),
    view: { ...baseView(articleClassNames) }
  })

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
      category: ARTICLES_BLOCK_CATEGORY,
      icon: ArticleTopIcon,
      blockName: articleTopBlockName,
      template: articleBlocks[articleTopBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Image Left',
      category: ARTICLES_BLOCK_CATEGORY,
      icon: ArticleLeftIcon,
      blockName: articleLeftBlockName,
      template: articleBlocks[articleLeftBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Image Right',
      category: ARTICLES_BLOCK_CATEGORY,
      icon: ArticleRightIcon,
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

  return handleBlockDragStopEvent<ArticleMetadata[], ArticleRenderData>(
    editor,
    allBlocks,
    articles => ({
      ...renderData,
      articles
    }),
    onArticleDrop
  )
}
