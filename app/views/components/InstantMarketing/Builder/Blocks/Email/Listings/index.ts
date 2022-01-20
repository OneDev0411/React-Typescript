import { Model } from 'backbone'
import { Editor } from 'grapesjs'

import ImageLeftIcon from 'assets/images/marketing/editor/blocks/image-left.png'
import ImageRightIcon from 'assets/images/marketing/editor/blocks/image-right.png'
import ImageTopIcon from 'assets/images/marketing/editor/blocks/image-top.png'
import GridIcon from 'assets/images/marketing/editor/blocks/listing-grid.png'
import ImageIcon from 'assets/images/marketing/editor/blocks/listing-image.png'
import { isLeaseProperty } from 'utils/listing'

import {
  BASICS_BLOCK_CATEGORY,
  LISTINGS_BLOCK_CATEGORY
} from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { RegisterBlockSelectHandler, TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'

import GridTwo from './grid-two.mjml'
import Grid from './grid.mjml'
import Image from './image.mjml'
import Left from './left.mjml'
import Right from './right.mjml'
import Top from './top.mjml'

export const listingImageBlockName = 'rechat-listing-image'
export const listingTopBlockName = 'rechat-listing-image-top'
export const listingLeftBlockName = 'rechat-listing-image-left'
export const listingRightBlockName = 'rechat-listing-image-right'
export const listingGridBlockName = 'rechat-listing-grid'
export const listingGridTwoBlockName = 'rechat-listing-grid-two'

export interface Options {
  onDrop: (model: Model) => void
}

type ListingItem = IListing & { is_lease?: boolean }

interface ListingRenderData {
  listings: ListingItem[]
}

export default function registerListingBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { onDrop }: Options
): RegisterBlockSelectHandler<ListingItem[]> {
  const listingBlocks = {
    [listingImageBlockName]:
      templateBlockOptions.blocks[listingImageBlockName]?.template || Image,
    [listingTopBlockName]:
      templateBlockOptions.blocks[listingTopBlockName]?.template || Top,
    [listingLeftBlockName]:
      templateBlockOptions.blocks[listingLeftBlockName]?.template || Left,
    [listingRightBlockName]:
      templateBlockOptions.blocks[listingRightBlockName]?.template || Right,
    [listingGridBlockName]:
      templateBlockOptions.blocks[listingGridBlockName]?.template || Grid,
    [listingGridTwoBlockName]:
      templateBlockOptions.blocks[listingGridTwoBlockName]?.template || GridTwo
  }

  registerBlock(
    editor,
    {
      label: 'Listing Image',
      icon: ImageIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: listingImageBlockName,
      template: listingBlocks[listingImageBlockName],
      adaptive: true
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Image Top',
      icon: ImageTopIcon,
      category: LISTINGS_BLOCK_CATEGORY,
      blockName: listingTopBlockName,
      template: listingBlocks[listingTopBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Grid',
      icon: GridIcon,
      category: LISTINGS_BLOCK_CATEGORY,
      blockName: listingGridBlockName,
      template: listingBlocks[listingGridBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Image Left',
      icon: ImageLeftIcon,
      category: LISTINGS_BLOCK_CATEGORY,
      blockName: listingLeftBlockName,
      template: listingBlocks[listingLeftBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Aligned Grid',
      icon: GridIcon,
      category: LISTINGS_BLOCK_CATEGORY,
      blockName: listingGridTwoBlockName,
      template: listingBlocks[listingGridTwoBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Image Right',
      icon: ImageRightIcon,
      category: LISTINGS_BLOCK_CATEGORY,
      blockName: listingRightBlockName,
      template: listingBlocks[listingRightBlockName]
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Listings',
    listingBlocks,
    templateBlockOptions.blocks
  )

  return handleBlockDragStopEvent<ListingItem[], ListingRenderData>(
    editor,
    allBlocks,
    listings => ({
      ...renderData,
      listings: listings.map(listing => ({
        ...listing,
        is_lease: isLeaseProperty(listing)
      }))
    }),
    onDrop
  )
}
