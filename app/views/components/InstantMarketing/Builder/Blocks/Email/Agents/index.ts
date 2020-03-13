import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import { AgentItem } from 'components/TeamAgents/types'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { getNameInitialsPlaceholderImage } from 'utils/helpers'

import { TemplateRenderData } from '../../../utils/get-template-render-data'
import { AGENTS_BLOCK_CATEGORY } from '../../../constants'
import registerBlock from '../../registerBlock'

import Left from './left.mjml'
import Grid from './grid.mjml'
import Multi from './multi.mjml'

export const agentLeftBlockName = 'rechat-agent-left'
export const agentGridBlockName = 'rechat-agent-grid'
export const agentMultiBlockName = 'rechat-agent-multi'

const templates = {
  [agentLeftBlockName]: Left,
  [agentGridBlockName]: Grid,
  [agentMultiBlockName]: Multi
}

export interface Options {
  onDrop: (model: Model) => void
}

interface AgentBlock {
  selectHandler: (selectedAgents?: AgentItem[]) => void
}

let modelHandle: any
let renderData: TemplateRenderData

const selectHandler = (agents?: AgentItem[]) => {
  if (!modelHandle) {
    return
  }

  const template = templates[modelHandle.attributes.attributes['data-block']]

  if (agents) {
    const mjml = nunjucks.renderString(template, {
      ...renderData,
      users: agents.map(item => {
        const profileImageUrl =
          item.agent.profile_image_url ||
          getNameInitialsPlaceholderImage(item.agent.display_name)

        return {
          ...item.agent,
          profile_image_url: profileImageUrl
        }
      })
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

  registerBlock(editor, {
    label: 'Grid',
    category: AGENTS_BLOCK_CATEGORY,
    blockName: agentGridBlockName,
    template: templates[agentGridBlockName]
  })

  registerBlock(editor, {
    label: 'Multi',
    category: AGENTS_BLOCK_CATEGORY,
    blockName: agentMultiBlockName,
    template: templates[agentMultiBlockName]
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
