import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../utils/get-template-render-data/index'
import { BlockOptions } from '../types'

import Single from './single.mjml'

const single = 'rechat-agent-single'

const templates = {}

templates[single] = Single

export interface Options {
  onDrop: (model: Model) => void
}

interface AgentBlock {
  selectHandler: (selectedAgent?: IAgent) => void
}

function registerAgentBlock(
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

const selectHandler = (agent?: IAgent) => {
  if (!modelHandle) {
    return
  }

  const template = templates[modelHandle.attributes.attributes['data-block']]

  if (agent) {
    const mjml = nunjucks.renderString(template, {
      ...renderData,
      user: agent
    })

    modelHandle.parent().append(mjml, { at: modelHandle.opt.at })
  }

  modelHandle.remove()
}

export default function registerAgentBlocks(
  editor: Editor,
  _renderData: TemplateRenderData,
  { onDrop }: Options
): AgentBlock {
  renderData = _renderData
  registerAgentBlock(editor, renderData, {
    label: 'Single Agent',
    category: 'Agent',
    blockName: single
  })

  editor.on('block:drag:stop', (model?: Model, block) => {
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
