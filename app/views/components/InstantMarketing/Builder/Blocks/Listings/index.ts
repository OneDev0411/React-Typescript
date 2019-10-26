import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../utils/get-template-render-data/index'
import { BlockOptions } from '../types'

import Top from './top.mjml'
import Right from './right.mjml'
import Left from './left.mjml'

const top = 'rechat-listing-image-top'
const left = 'rechat-listing-image-left'
const right = 'rechat-listing-image-right'

const templates = {}

templates[top] = Top
templates[right] = Right
templates[left] = Left

const CATEGORY = 'Listings'

export interface Options {
  onDrop: (model: Model) => void
}

interface ListingBlock {
  selectHandler: (selectedListing?: IListing) => void
}

function registerListingBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  { label, category, blockName }: BlockOptions
): void {
  editor.BlockManager.add(blockName, {
    category,
    label,
    content: `<div data-block="${blockName}"></div>`
  })
}

let modelHandle: any
let renderData: TemplateRenderData

const selectHandler = (listing?: IListing) => {
  if (!modelHandle) {
    return
  }

  const template = templates[modelHandle.attributes.attributes['data-block']]

  if (listing) {
    const mjml = nunjucks.renderString(template, {
      ...renderData,
      listing
    })

    modelHandle.parent().append(mjml, { at: modelHandle.opt.at })
  }

  modelHandle.remove()
}

export default function registerListingBlocks(
  editor: Editor,
  _renderData: TemplateRenderData,
  { onDrop }: Options
): ListingBlock {
  renderData = _renderData
  registerListingBlock(editor, renderData, {
    label: 'Image Top',
    category: CATEGORY,
    blockName: top
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Left',
    category: CATEGORY,
    blockName: left
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Right',
    category: CATEGORY,
    blockName: right
  })

  editor.on('block:drag:stop', (model: Model, block) => {
    if (!model) {
      return
    }

    if (templates[block.id]) {
      modelHandle = model
      onDrop(model)
    }
  })

  return {
    selectHandler
  }
}
