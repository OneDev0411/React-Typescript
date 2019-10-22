import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../utils/get-template-render-data/index'
import { BlockOptions } from './types'

const TEMPLATE = `
<mj-section data-block="rechat-listing" background-color="#fff" padding="56px 40px">
<mj-group data-gjs-removable="false">
  <mj-wrapper data-gjs-removable="false" background-color="#ffffff" border="1px solid #000000" padding="50px 30px">
    <mj-column padding="0px">
      <mj-image padding="0px" align="center" rechat-assets="listing-image" rechat-listing="{{ listing_id }}" src="{{ image }}" width="135px" height="135px"></mj-image>
    </mj-column>

    <mj-column vertical-align="middle" padding-top="20px" padding="0px">
      <mj-text padding="0px" rechat-editable="true" align="left" color="#000" font-size="11px" font-family="Barlow" font-weight="bold">
        <p>{{ address }}</p>
      </mj-text>
      <mj-text padding="0px" rechat-editable="true" align="left" color="#000" font-size="11px" font-family="Barlow">
        <p>
          <a href="" color="#000">Test Text</a>
        </p>
      </mj-text>
      <mj-text padding="0px" rechat-editable="true" align="left" color="#000" font-size="11px" font-family="Barlow" color="#000">
        <p>
          <a href="" color="#000">Test Text 2</a>
        </p>
      </mj-text>
    </mj-column>
  </mj-wrapper>
</mj-group>
</mj-section>
`

export interface Options {
  onDrop: (model: Model) => void
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
) {
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
        image: listing.cover_image_url,
        address: listing.property.address.full_address,
        listing_id: listing.id
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
