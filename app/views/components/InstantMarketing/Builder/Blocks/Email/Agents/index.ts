import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../../utils/get-template-render-data'
import { AGENTS_BLOCK_CATEGORY } from '../../../constants'
import registerBlock from '../../registerBlock'

import Left from './left.mjml'

export const agentLeftBlockName = 'rechat-agent-left'

const templates = {}

templates[agentLeftBlockName] = Left

export interface Options {
  onDrop: (model: Model) => void
}

interface AgentBlock {
  selectHandler: (selectedAgent?: IAgent) => void
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
  registerBlock(editor, {
    label: 'Image Left',
    category: AGENTS_BLOCK_CATEGORY,
    blockName: agentLeftBlockName,
    template: templates[agentLeftBlockName]
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
