import { Model } from 'backbone'
import { Editor } from 'grapesjs'

import { getNameInitialsPlaceholderImage } from '@app/utils/helpers'
import { Agent, BrandedUser } from '@app/views/components/TeamAgents/types'
import AgentGridIcon from 'assets/images/marketing/editor/blocks/agent-grid.png'
import AgentLeftIcon from 'assets/images/marketing/editor/blocks/agent-left.png'

import { AGENTS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { TemplateBlockOptions, RegisterBlockSelectHandler } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'
import { baseView, isComponent } from '../utils'

import AgentGrid from './agent-grid.njk'
import AgentLeft from './agent-left.njk'

const typeAgentGroup = 'agent-group'
const typeAgentList = 'agent-list'
const typeAgentItem = 'agent-item'

export const agentLeftBlockName = 'agent-left'
export const agentGridBlockName = 'agent-grid'

interface AgentRenderData {
  users: BrandedUser[]
}

export interface AgentBlocksOptions {
  agentGroupClassNames?: string
  agentListClassNames?: string
  agentItemClassNames?: string
  onAgentDrop: (model: Model) => void
}

export default function registerAgentBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  {
    agentGroupClassNames,
    agentListClassNames,
    agentItemClassNames,
    onAgentDrop
  }: AgentBlocksOptions
): RegisterBlockSelectHandler<Agent[]> {
  editor.DomComponents.addType(typeAgentGroup, {
    isComponent: isComponent(typeAgentGroup),
    model: {
      defaults: {
        droppable: `[data-gjs-type="${typeAgentList}"]`
      }
    },
    view: { ...baseView(agentGroupClassNames) }
  })

  editor.DomComponents.addType(typeAgentList, {
    isComponent: isComponent(typeAgentList),
    model: {
      defaults: {
        droppable: `[data-gjs-type="${typeAgentItem}"]`
      }
    },
    view: { ...baseView(agentListClassNames) }
  })

  editor.DomComponents.addType(typeAgentItem, {
    isComponent: isComponent(typeAgentItem),
    model: { defaults: { droppable: false } },
    view: { ...baseView(agentItemClassNames) }
  })

  const agentBlocks = {
    [agentLeftBlockName]:
      templateBlockOptions.blocks[agentLeftBlockName]?.template || AgentLeft,
    [agentGridBlockName]:
      templateBlockOptions.blocks[agentGridBlockName]?.template || AgentGrid
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

  const allBlocks = registerTemplateBlocks(
    editor,
    'Agents',
    agentBlocks,
    templateBlockOptions.blocks
  )

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
    onAgentDrop
  )
}
