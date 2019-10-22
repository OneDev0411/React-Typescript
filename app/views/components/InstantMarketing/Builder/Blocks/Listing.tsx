import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../utils/get-template-render-data/index'
import { BlockOptions } from './types'

const TEMPLATE = `
<mj-wrapper data-block="rechat-listing" background-color="{{getColor('alpha.bg')}}">
  <mj-section background-color="#ffffff" padding-left="40px" padding-right="40px" padding-bottom="0px">
      <mj-column width="100%" padding="0px">
          <mj-image rechat-assets="listing-image" css-class="img-fit responsiveimg" padding="0px" src="{{listing.gallery_image_urls[0]}}"></mj-image>
      </mj-column>
  </mj-section>

  <mj-section background-color="#fff" padding="0px">
      <mj-group>
          <mj-column>
              <mj-text rechat-editable="true" padding="0 10px" css-class="text3" align="left" font-family="Barlow" font-size="34px" color="#002344" font-weight="bold">
                  <p color="#002344"> {{listing.property.address.street_address}} </p>
              </mj-text>

              <mj-text rechat-editable="true" padding="0 10px" css-class="text3" align="left" font-family="Barlow" font-size="23px" color="#002344" font-weight="bold">
                  <p color="#002344" style="margin:8px 0"> {{ listing.price | currency }}
                  </p>
              </mj-text>
              <mj-text rechat-editable="true" padding="0 10px" css-class="text3" align="left" font-family="Barlow" font-size="20px" color="#808080">
                  <p color="#808080" style="margin:8px 0">
                      {{listing.property.address.city}},{{listing.property.address.state}},{{listing.property.address.postal_code}}</p>
              </mj-text>

              <mj-text rechat-editable="true" css-class="text4" align="left" font-family="Barlow" font-size="18px" padding="0 10px" color="#002344">
                  <p color="#002344" id="text4" style="margin:8px 0"> {{listing.property.bedroom_count}} Beds, {{listing.property.full_bathroom_count + listing.property.half_bathroom_count}} Baths, {{ listing.property.square_meters | area }} Sqft</p>
              </mj-text>
          </mj-column>

      </mj-group>

  </mj-section>

  <mj-section background-color="#ffffff" padding="0px">
      <mj-column padding="0px">
          <mj-button rechat-editable="true" href="{{getListingUrl(listing)}}" background-color="{{getColor('beta.bg')}}" color="{{getColor('beta.ta')}}" padding="0px 0 10px" border-radius="none" font-family="Barlow" font-size="18px">
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

export default function registerListingBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  {
    label = 'Image Top',
    category = 'Listing',
    blockName = 'rechat-listing',
    onDrop
  }: BlockOptions & Options
): ListingBlock {
  console.log('RENDER DATA', renderData)
  editor.BlockManager.add(blockName, {
    category,
    label,
    content: TEMPLATE
  })

  let modelHandle: any

  const selectHandler = (listing?: IListing) => {
    console.log('SELECTED!', listing)
    console.log('MODEL HANDLE!', modelHandle)

    if (listing) {
      const mjml = nunjucks.renderString(TEMPLATE, {
        ...renderData,
        listing
      })

      console.log('mjml', mjml)

      modelHandle.parent().append(mjml, { at: modelHandle.opt.at })
    }

    modelHandle.remove()
  }

  editor.on('block:drag:stop', (model: Model) => {
    if (model.attributes.attributes['data-block'] !== blockName) {
      return
    }

    console.log('MODEL', model)

    modelHandle = model
    onDrop(model)
  })

  return {
    selectHandler
  }
}
