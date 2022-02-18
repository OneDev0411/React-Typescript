import { Model } from 'backbone'
import { Editor } from 'grapesjs'

import AgentGridIcon from 'assets/images/marketing/editor/blocks/agent-grid.png'
import AgentLeftIcon from 'assets/images/marketing/editor/blocks/agent-left.png'
import AgentMultiIcon from 'assets/images/marketing/editor/blocks/multi-agent.png'
import { Agent, BrandedUser } from 'components/TeamAgents/types'
import { getNameInitialsPlaceholderImage } from 'utils/helpers'

import { AGENTS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { RegisterBlockSelectHandler, TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'

import Grid from './grid.mjml'
import Left from './left.mjml'
import Multi from './multi.mjml'

export const agentLeftBlockName = 'rechat-agent-left'
export const agentGridBlockName = 'rechat-agent-grid'
export const agentMultiBlockName = 'rechat-agent-multi'

export interface Options {
  onDrop: (model: Model) => void
  shouldUseDefaultAgents: boolean
  defaultAgents: Agent[]
}

interface AgentRenderData {
  users: BrandedUser[]
}

export default function registerAgentBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { onDrop, shouldUseDefaultAgents, defaultAgents }: Options
): RegisterBlockSelectHandler<Agent[]> | void {
  const agentBlocks = {
    [agentLeftBlockName]:
      templateBlockOptions.blocks[agentLeftBlockName]?.template || Left,
    [agentGridBlockName]:
      templateBlockOptions.blocks[agentGridBlockName]?.template || Grid,
    [agentMultiBlockName]:
      templateBlockOptions.blocks[agentMultiBlockName]?.template || Multi
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
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Grid',
      icon: AgentGridIcon,
      category: AGENTS_BLOCK_CATEGORY,
      blockName: agentGridBlockName,
      template: agentBlocks[agentGridBlockName]
    },
    templateBlockOptions
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
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Agents',
    agentBlocks,
    templateBlockOptions.blocks
  )

  if (shouldUseDefaultAgents) {
    return handleBlockDragStopEvent<AgentRenderData>(editor, allBlocks, {
      ...renderData,
      users: defaultAgents.map(item => item.agent)
    })
  }

  return handleBlockDragStopEvent<Agent[], AgentRenderData>(
    editor,
    allBlocks,
    agents => ({
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
