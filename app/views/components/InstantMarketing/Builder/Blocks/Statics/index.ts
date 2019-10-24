import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../utils/get-template-render-data/index'

import { BlockOptions } from '../types'

const top = 'rechat-article-image-top'
const dual = 'rechat-article-image-dual'
const left = 'rechat-article-image-left'
const right = 'rechat-article-image-right'

const templates = {}

templates[top] = `
<mj-section padding-left="32px" padding-right="32px">
  <mj-column width="100%">

    <mj-image src="https://picsum.photos/id/283/3823/2538"></mj-image>

    <mj-text font-family="Abril Fatface" font-size="32px" line-height="43px" color="#242F3C">
      How Much Public Transit Adds to Home Values
    </mj-text>


    <mj-text font-family="Roboto" font-weight="300" font-size="14px" line-height="16px" align="justify" color="#242F3C">
      Neighborhoods located within a half-mile of public transit services outperformed those farther from public transit based on a number of factors, according to a report released Monday by the National Association of REALTORS® and the American Public Transportation
      Association.
    </mj-text>

    <mj-button border-radius="12px" font-family="Roboto" font-size="12px" font-weight="Bold" line-height="14px" width="258px" height="48px" color="{{getColor('beta.tb')}}" background-color="{{getColor('beta.bg')}}">
      READ MORE
    </mj-button>
  </mj-column>
</mj-section>
`

templates[dual] = `
<mj-section>
  <mj-column>
    <mj-image src="https://picsum.photos/id/1040/4496/3000">
    </mj-image>
    <mj-text font-family="Abril Fatface" font-size="20px" line-height="27px" color="#242F3C">
      When the Dream of Owning a Home...
    </mj-text>
    <mj-text height="48px" font-family="Roboto" font-weight="300" font-size="14px" line-height="16px" align="justify" color="#242F3C">
      A federal program to encourage black homeownership in the 1970s ended in a flood of foreclosures.
    </mj-text>
    <mj-button border-radius="12px" font-family="Roboto" font-size="12px" font-weight="Bold" line-height="14px" width="100%" height="40px" color="{{getColor('beta.tb')}}" background-color="{{getColor('beta.bg')}}">
      READ MORE
    </mj-button>
  </mj-column>
  <mj-column>
    <mj-image src="https://picsum.photos/id/1026/4621/3070">
    </mj-image>
    <mj-text font-family="Abril Fatface" font-size="20px" line-height="27px" color="#242F3C">
      How Much Public Transit Adds to Home Values
    </mj-text>
    <mj-text height="48px" font-family="Roboto" font-weight="300" font-size="14px" line-height="16px" align="justify" color="#242F3C">
      Neighborhoods located within a half-mile of public transit services outperformed those farther from public transit. </mj-text>
    <mj-button border-radius="12px" font-family="Roboto" font-size="12px" font-weight="Bold" line-height="14px" width="100%" height="40px" color="{{getColor('beta.tb')}}" background-color="{{getColor('beta.bg')}}">
      READ MORE
    </mj-button>
  </mj-column>
</mj-section>
`

templates[left] = `
<mj-section>
  <mj-column width="33%">
    <mj-image padding=0 align="left" src="https://picsum.photos/id/1015/180/180" />
  </mj-column>
  <mj-column width="66%">
    <mj-text font-family="Roboto" font-weight="Bold" font-size="20px" line-height="27px" color="#242F3C" padding-top=0>
      When the Dream of Owning a Home Became a Nightmare
    </mj-text>
    <mj-text font-family="Roboto" font-size="14px" line-height="16px" color="#242F3C">
      A federal program to encourage black homeownership in the 1970s ended in a flood of foreclosures.
    </mj-text>
    <mj-button border-radius="12px" font-family="Roboto" font-size="12px" font-weight="Bold" line-height="14px" width="100%" height="40px" color="{{getColor('beta.tb')}}" background-color="{{getColor('beta.bg')}}">
      READ MORE
    </mj-button>
  </mj-column>
</mj-section>
`

templates[right] = `
<mj-section>
  <mj-column width="66%">
    <mj-text font-family="Roboto" font-weight="Bold" font-size="20px" line-height="27px" color="#242F3C" padding-top=0 padding-left=0>
      When the Dream of Owning a Home Became a Nightmare
    </mj-text>
    <mj-text font-family="Roboto" font-size="14px" line-height="16px" color="#242F3C" padding-left=0>
      A federal program to encourage black homeownership in the 1970s ended in a flood of foreclosures.
    </mj-text>
    <mj-button padding-left=0 border-radius="12px" font-family="Roboto" font-size="12px" font-weight="Bold" line-height="14px" width="100%" height="40px" color="{{getColor('beta.tb')}}" background-color="{{getColor('beta.bg')}}">
      READ MORE
    </mj-button>
  </mj-column>
  <mj-column width="33%">
    <mj-image padding=0 align="left" src="https://picsum.photos/id/1015/180/180" />
  </mj-column>
</mj-section>
`

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

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData
): void {
  registerListingBlock(editor, renderData, {
    label: 'Image Top',
    category: 'Article',
    blockName: top
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Left',
    category: 'Article',
    blockName: left
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Right',
    category: 'Article',
    blockName: right
  })

  editor.on('block:drag:stop', (model: Model, block) => {
    if (!model) {
      return
    }

    if (!templates[block.id]) {
      return
    }

    const template = templates[model.attributes.attributes['data-block']]

    const mjml = nunjucks.renderString(template, {
      ...renderData
    })

    model.parent().append(mjml, { at: model.opt.at })

    model.remove()
  })
}
