import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../utils/get-template-render-data'
import { BlockOptions } from './types'

const TEMPLATE = `
<mj-wrapper data-block="rechat-avatar" background-color="{{ getColor('alpha.bg') }}" border="1px solid #000000">
  <mj-column padding="0px">
    <mj-image padding="0px" align="center" src="{{ user.profile_image_url }}" width="135px" height="135px"></mj-image>
  </mj-column>

  <mj-column vertical-align="middle" padding-top="20px" padding="0px">
    <mj-text padding="0px" rechat-editable="true" align="left" color="#000" font-size="11px" font-family="Barlow" font-weight="bold">
      <p id="text1">{{user.display_name}}</p>
    </mj-text>
    <mj-text padding="0px" rechat-editable="true" align="left" color="#000" font-size="11px" font-family="Barlow">
      <p id="text2">
        <a href="mailto:{{user.email}}" color="#000">{{user.email}}</a>
      </p>
    </mj-text>
    <mj-text padding="0px" rechat-editable="true" align="left" color="#000" font-size="11px" font-family="Barlow" color="#000">
      <p id="text3">
        <a href="tel:{{ user.phone_number | phone }}" color="#000">{{user.phone_number}}</a>
      </p>
    </mj-text>
  </mj-column>
</mj-wrapper>
`

export interface Options {
  onDrop: (model: Model) => void
}

interface ListingBlock {
  selectHandler: (selectedAgent?: IAgent) => void
}

export default function registerAgentBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  {
    label = 'Image Top',
    category = 'Agent',
    blockName = 'rechat-avatar',
    onDrop
  }: BlockOptions & Options
): ListingBlock {
  editor.BlockManager.add(blockName, {
    category,
    label,
    content: TEMPLATE
  })

  let modelHandle: any

  const selectHandler = (agent?: IAgent) => {
    console.log('SELECTED!', agent)
    console.log('MODEL HANDLE!', modelHandle)

    console.log('AGENT', agent)

    if (agent) {
      const mjml = nunjucks.renderString(TEMPLATE, {
        ...renderData,
        user: agent
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
