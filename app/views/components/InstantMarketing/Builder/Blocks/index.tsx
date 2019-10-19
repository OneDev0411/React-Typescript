import { Editor } from 'grapesjs'

import registerListingBlock, { Options as ListingOptions } from './Listing'

interface Options {
  listing: ListingOptions
}

export default function registerBlocks(editor: Editor, { listing }: Options) {
  return {
    listing: registerListingBlock(editor, listing)
  }
}
