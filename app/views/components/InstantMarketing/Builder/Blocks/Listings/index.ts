import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../utils/get-template-render-data/index'
import { BlockOptions } from '../types'

const top = 'rechat-listing-image-top'
const left = 'rechat-listing-image-left'
const right = 'rechat-listing-image-right'

const templates = {}

templates[top] = `
<mj-section>
      <mj-column width="100%">
      <mj-image
        height="220px"
        rechat-assets="listing-image"
        rechat-listing="{{ listing.id }}"
        src="{{listing.gallery_image_urls[0]}}"
        align="center"
        padding=0 />
      </mj-column>

      <mj-column width="100%">
        <mj-text font-family="Roboto" font-weight="Bold" font-size="16px" line-height="19px" color="#242F3C" padding-left=0 align="center">
          {{listing.property.address.street_address}}
          <br /><span style="font-weight: normal;">{{ listing.price | currency }}</span>
        </mj-text>

        <mj-divider border-color="rgba(0,0,0,0.3)" border-width="1px" width="60%" />

        <mj-text font-family="Roboto" font-size="14px" line-height="16px" color="#242F3C" padding-left=0 align="center">
          OPEN SUNDAY, JUNE 30, 2019
          <br /><span style="font-weight: lighter;">FROM 1:00 TO 3:00 PM</span>
        </mj-text>

        <mj-button
          padding-left=0
          border-radius="12px"
          font-family="Roboto"
          font-size="12px"
          font-weight="Bold"
          line-height="14px"
          height="40px"
          href="{{getListingUrl(listing)}}"
          color="{{getColor('beta.tb')}}"
          background-color="{{getColor('beta.bg')}}"
          width="258px">
          VIEW PROPERTY
        </mj-button>
      </mj-column>
    </mj-section>
`

templates[right] = `
<mj-section>
  <mj-column>
    <mj-text font-family="Roboto" font-weight="Bold" font-size="16px" line-height="19px" color="#242F3C">
      {{listing.property.address.street_address}}
      <br />
      <span style="font-weight: normal;">{{ listing.price | currency }}</span>
    </mj-text>
    <mj-divider border-color="rgba(0,0,0,0.3)" border-width="1px" padding-left="25px" padding-right="25px" padding-top="0" padding-bottom="0"></mj-divider>
    <mj-text font-family="Roboto" font-size="14px" line-height="16px" color="#242F3C">
      OPEN SUNDAY, JUNE 30
      <br />
      <span style="color: ##919191;">FROM 1:00 TO 3:00 PM</span>
    </mj-text>
    <mj-button
      border-radius="12px"
      font-family="Roboto"
      font-size="12px"
      font-weight="Bold"
      line-height="14px"
      width="100%"
      height="40px"
      href="{{getListingUrl(listing)}}"
      color="{{getColor('beta.tb')}}"
      background-color="{{getColor('beta.bg')}}">
      VIEW PROPERTY
    </mj-button>
  </mj-column>
  <mj-column width="50%">
    <mj-image
      rechat-assets="listing-image"
      rechat-listing="{{ listing.id }}"
      src="{{listing.gallery_image_urls[0]}}"></mj-image>
  </mj-column>
</mj-section>
`

templates[left] = `
<mj-section>
  <mj-column width="50%">
    <mj-image
      rechat-assets="listing-image"
      rechat-listing="{{ listing.id }}"
      src="{{listing.gallery_image_urls[0]}}"></mj-image>
  </mj-column>
  <mj-column>
    <mj-text font-family="Roboto" font-weight="Bold" font-size="16px" line-height="19px" color="#242F3C">
      {{listing.property.address.street_address}}
      <br />
      <span style="font-weight: normal;">{{ listing.price | currency }}</span>
    </mj-text>
    <mj-divider border-color="rgba(0,0,0,0.3)" border-width="1px" padding-left="25px" padding-right="25px" padding-top="0" padding-bottom="0"></mj-divider>
    <mj-text font-family="Roboto" font-size="14px" line-height="16px" color="#242F3C">
      OPEN SUNDAY, JUNE 30
      <br />
      <span style="color: ##919191;">FROM 1:00 TO 3:00 PM</span>
    </mj-text>
    <mj-button
      href="{{getListingUrl(listing)}}"
      border-radius="12px"
      font-family="Roboto"
      font-size="12px"
      font-weight="Bold"
      line-height="14px"
      width="100%"
      height="40px"
      color="{{getColor('beta.tb')}}"
      background-color="{{getColor('beta.bg')}}">
      VIEW PROPERTY
    </mj-button>
  </mj-column>
</mj-section>
`

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
    category: 'Listing',
    blockName: top
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Left',
    category: 'Listing',
    blockName: left
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Right',
    category: 'Listing',
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
