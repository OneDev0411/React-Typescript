import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import AgentLeftIcon from 'assets/images/marketing/editor/blocks/agent-left.png'
import AgentMultiIcon from 'assets/images/marketing/editor/blocks/multi-agent.png'
import DualIcon from 'assets/images/marketing/editor/blocks/dual.png'

import { AgentItem } from 'components/TeamAgents/types'

import { getNameInitialsPlaceholderImage } from 'utils/helpers'

import { TemplateRenderData } from '../../../utils/get-template-render-data'
import { AGENTS_BLOCK_CATEGORY } from '../../../constants'
import registerBlock from '../../registerBlock'

import Left from './left.mjml'
import Grid from './grid.mjml'
import Multi from './multi.mjml'
import { handleBlockDragStopEvent } from '../../utils'
import { TemplateBlocks } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

export const agentLeftBlockName = 'rechat-agent-left'
export const agentGridBlockName = 'rechat-agent-grid'
export const agentMultiBlockName = 'rechat-agent-multi'

export interface Options {
  onDrop: (model: Model) => void
}

interface AgentBlock {
  selectHandler: (selectedAgents?: AgentItem[]) => void
}

export default function registerAgentBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlocks: TemplateBlocks,
  { onDrop }: Options
): AgentBlock {
  const agentBlocks = {
    [agentLeftBlockName]: templateBlocks[agentLeftBlockName]?.template || Left,
    [agentGridBlockName]: templateBlocks[agentGridBlockName]?.template || Grid,
    [agentMultiBlockName]:
      templateBlocks[agentMultiBlockName]?.template || Multi
  }

  registerBlock(
    editor,
    {
      label: 'Image Left',
      icon: AgentLeftIcon,
      category: AGENTS_BLOCK_CATEGORY,
      blockName: agentLeftBlockName,
      template: agentBlocks[agentLeftBlockName]
    },
    templateBlocks[agentLeftBlockName]
  )

  registerBlock(
    editor,
    {
      label: 'Grid',
      icon: DualIcon,
      category: AGENTS_BLOCK_CATEGORY,
      blockName: agentGridBlockName,
      template: agentBlocks[agentGridBlockName]
    },
    templateBlocks[agentGridBlockName]
  )

  registerBlock(
    editor,
    {
      label: 'Multi',
      icon: AgentMultiIcon,
      category: AGENTS_BLOCK_CATEGORY,
      blockName: agentMultiBlockName,
      template: agentBlocks[agentMultiBlockName]
    },
    templateBlocks[agentMultiBlockName]
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Agents',
    agentBlocks,
    templateBlocks
  )

  return handleBlockDragStopEvent(
    editor,
    allBlocks,
    (agents: AgentItem[]) => ({
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
    }),
    onDrop
  )
}
