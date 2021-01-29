import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import AgentLeftIcon from 'assets/images/marketing/editor/blocks/agent-left.png'
import DualIcon from 'assets/images/marketing/editor/blocks/dual.png'

import { AgentItem } from 'components/TeamAgents/types'

import { getNameInitialsPlaceholderImage } from 'utils/helpers'

import registerBlock from '../../registerBlock'
import { AGENTS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, handleBlockDragStopEvent, isComponent } from '../utils'
import AgentLeft from './agent-left.njk'
import AgentGrid from './agent-grid.njk'

const typeAgentGroup = 'agent-group'
const typeAgentList = 'agent-list'
const typeAgentItem = 'agent-item'

const agentLeftBlockName = 'agent-left'
const agentGridBlockName = 'agent-grid'

export interface AgentBlocksOptions {
  agentGroupClassNames?: string
  agentListClassNames?: string
  agentItemClassNames?: string
  agentLeftBlock?: string
  agentGridBlock?: string
  onAgentDrop: (model: Model) => void
}

interface AgentBlocks {
  selectHandler: (selectedImage?: AgentItem[]) => void
}

export default function registerAgentBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  {
    agentGroupClassNames,
    agentListClassNames,
    agentItemClassNames,
    agentLeftBlock,
    agentGridBlock,
    onAgentDrop
  }: AgentBlocksOptions
): AgentBlocks {
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

  registerBlock(editor, {
    label: 'Image Left',
    icon: AgentLeftIcon,
    category: AGENTS_BLOCK_CATEGORY,
    blockName: agentLeftBlockName,
    template: AgentLeft
  })

  registerBlock(editor, {
    label: 'Grid',
    icon: DualIcon,
    category: AGENTS_BLOCK_CATEGORY,
    blockName: agentGridBlockName,
    template: AgentGrid
  })

  return handleBlockDragStopEvent(
    editor,
    {
      [agentLeftBlockName]: agentLeftBlock || AgentLeft,
      [agentGridBlockName]: agentGridBlock || AgentGrid
    },
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
    onAgentDrop
  )
}
