import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../utils/get-template-render-data/index'
import { BlockOptions } from '../types'

const top = 'rechat-listing-image-top'
const bottom = 'rechat-listing-image-bottom'
const left = 'rechat-listing-image-left'
const right = 'rechat-listing-image-right'

const templates = {}

templates[top] = `
<mj-wrapper background-color="{{getColor('alpha.bg')}}">
  <mj-section background-color="#ffffff" padding-left="40px" padding-right="40px" padding-bottom="0px">
      <mj-column width="100%" padding="0px">
          <mj-image rechat-assets="listing-image" padding="0px" src="{{listing.gallery_image_urls[0]}}"></mj-image>
      </mj-column>
  </mj-section>

  <mj-section background-color="#fff" padding="0px">
      <mj-group>
          <mj-column>
              <mj-text rechat-editable="true" padding="0 10px" align="left" font-family="Barlow" font-size="34px" color="#002344" font-weight="bold">
                  <p color="#002344"> {{listing.property.address.street_address}} </p>
              </mj-text>

              <mj-text rechat-editable="true" padding="0 10px" align="left" font-family="Barlow" font-size="23px" color="#002344" font-weight="bold">
                  <p color="#002344" style="margin:8px 0"> {{ listing.price | currency }}
                  </p>
              </mj-text>
              <mj-text rechat-editable="true" align="left" font-family="Barlow" font-size="18px" padding="0 10px" color="#002344">
                  <p color="#002344" id="text4" style="margin:8px 0"> {{listing.property.bedroom_count}} Beds, {{listing.property.full_bathroom_count + listing.property.half_bathroom_count}} Baths, {{ listing.property.square_meters | area }} Sqft</p>
              </mj-text>
          </mj-column>

      </mj-group>

  </mj-section>

  <mj-section background-color="#ffffff" padding="0px">
      <mj-column padding="0px">
          <mj-button rechat-editable="true" href="{{getListingUrl(listing)}}" background-color="{{getColor('beta.bg')}}" color="{{getColor('beta.tb')}}" padding="0px 0 10px" border-radius="none" font-family="Barlow" font-size="18px">
              VIEW PROPERTY
          </mj-button>
      </mj-column>
  </mj-section>
</mj-wrapper>
`

templates[bottom] = `
<mj-wrapper background-color="{{getColor('alpha.bg')}}">
  <mj-section background-color="#fff" padding="0px">
      <mj-group>
          <mj-column>
              <mj-text rechat-editable="true" padding="0 10px" align="left" font-family="Barlow" font-size="34px" color="#002344" font-weight="bold">
                  <p color="#002344"> {{listing.property.address.street_address}} </p>
              </mj-text>

              <mj-text rechat-editable="true" padding="0 10px" align="left" font-family="Barlow" font-size="23px" color="#002344" font-weight="bold">
                  <p color="#002344" style="margin:8px 0"> {{ listing.price | currency }}
                  </p>
              </mj-text>
              <mj-text rechat-editable="true" align="left" font-family="Barlow" font-size="18px" padding="0 10px" color="#002344">
                  <p color="#002344" id="text4" style="margin:8px 0"> {{listing.property.bedroom_count}} Beds, {{listing.property.full_bathroom_count + listing.property.half_bathroom_count}} Baths, {{ listing.property.square_meters | area }} Sqft</p>
              </mj-text>
          </mj-column>

      </mj-group>

  </mj-section>

  <mj-section background-color="#ffffff" padding="0px">
      <mj-column padding="0px">
          <mj-button rechat-editable="true" href="{{getListingUrl(listing)}}" background-color="{{getColor('beta.bg')}}" color="{{getColor('beta.tb')}}" padding="0px 0 10px" border-radius="none" font-family="Barlow" font-size="18px">
              VIEW PROPERTY
          </mj-button>
      </mj-column>
  </mj-section>

  <mj-section background-color="#ffffff" padding-left="40px" padding-right="40px" padding-bottom="0px">
      <mj-column width="100%" padding="0px">
          <mj-image rechat-assets="listing-image" padding="0px" src="{{listing.gallery_image_urls[0]}}"></mj-image>
      </mj-column>
  </mj-section>
</mj-wrapper>
`

templates[right] = `
<mj-wrapper background-color="{{getColor('alpha.bg')}}">
    <mj-section background-color="#fff" padding="0px">
        <mj-column>
            <mj-text rechat-editable="true" padding="0 10px" align="left" font-family="Barlow" font-size="22px" color="#002344" font-weight="bold">
                <p color="#002344"> {{listing.property.address.street_address}} </p>
            </mj-text>

            <mj-text rechat-editable="true" padding="0 10px" align="left" font-family="Barlow" font-size="15px" color="#002344" font-weight="bold">
                <p color="#002344" style="margin:8px 0"> {{ listing.price | currency }}
                </p>
            </mj-text>
            <mj-text rechat-editable="true" align="left" font-family="Barlow" font-size="15px" padding="0 10px" color="#002344">
                <p color="#002344" id="text4" style="margin:8px 0"> {{listing.property.bedroom_count}} Beds, {{listing.property.full_bathroom_count + listing.property.half_bathroom_count}} Baths, {{ listing.property.square_meters | area }} Sqft</p>
            </mj-text>

            <mj-button align="left" rechat-editable="true" href="{{getListingUrl(listing)}}" background-color="{{getColor('beta.bg')}}" color="{{getColor('beta.tb')}}" padding="0px 0 10px" border-radius="none" font-family="Barlow" font-size="18px">
                VIEW PROPERTY
            </mj-button>
        </mj-column>
        <mj-column width="50%" padding="0px">
            <mj-image rechat-assets="listing-image" padding="0px" src="{{listing.gallery_image_urls[0]}}"></mj-image>
        </mj-column>
    </mj-section>
</mj-wrapper>
`

templates[left] = `
<mj-wrapper background-color="{{getColor('alpha.bg')}}">
    <mj-section background-color="#fff" padding="0px">
        <mj-column width="50%" padding="0px">
            <mj-image rechat-assets="listing-image" padding="0px" src="{{listing.gallery_image_urls[0]}}"></mj-image>
        </mj-column>
        <mj-column>
            <mj-text rechat-editable="true" padding="0 10px" align="right" font-family="Barlow" font-size="22px" color="#002344" font-weight="bold">
                <p color="#002344"> {{listing.property.address.street_address}} </p>
            </mj-text>

            <mj-text rechat-editable="true" padding="0 10px" align="right" font-family="Barlow" font-size="15px" color="#002344" font-weight="bold">
                <p color="#002344" style="margin:8px 0"> {{ listing.price | currency }}
                </p>
            </mj-text>
            <mj-text rechat-editable="true" align="right" font-family="Barlow" font-size="15px" padding="0 10px" color="#002344">
                <p color="#002344" id="text4" style="margin:8px 0"> {{listing.property.bedroom_count}} Beds, {{listing.property.full_bathroom_count + listing.property.half_bathroom_count}} Baths, {{ listing.property.square_meters | area }} Sqft</p>
            </mj-text>

            <mj-button align="right" rechat-editable="true" href="{{getListingUrl(listing)}}" background-color="{{getColor('beta.bg')}}" color="{{getColor('beta.tb')}}" padding="0px 0 10px" border-radius="none" font-family="Barlow" font-size="18px">
                VIEW PROPERTY
            </mj-button>
        </mj-column>
    </mj-section>
</mj-wrapper>
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
    label: 'Image Bottom',
    category: 'Listing',
    blockName: bottom
  })

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
    if (templates[block.id]) {
      modelHandle = model
      onDrop(model)
    }
  })

  return {
    selectHandler
  }
}
