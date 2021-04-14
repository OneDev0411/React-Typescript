import { Editor } from 'grapesjs'

import { BASICS_BLOCK_CATEGORY } from 'components/InstantMarketing/Builder/constants'

import OneColIcon from 'assets/images/marketing/editor/blocks/col-1.png'
import TwoColIcon from 'assets/images/marketing/editor/blocks/col-2.png'
import ThreeColIcon from 'assets/images/marketing/editor/blocks/col-3.png'

import registerBlock from '../../registerBlock'
import { baseView, isComponent } from '../utils'
import GridColumn1 from './grid-column-1.njk'
import GridColumn2 from './grid-column-2.njk'
import GridColumn3 from './grid-column-3.njk'
import { TemplateBlockOptions } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

const typeGridRow = 'grid-row'
const typeGridColumn = 'grid-column'
export const gridColumn1BlockName = `${typeGridColumn}-1`
export const gridColumn2BlockName = `${typeGridColumn}-2`
export const gridColumn3BlockName = `${typeGridColumn}-3`

export interface GridBlockOptions {
  gridRowClassNames?: string
  gridColumnClassNames?: string
}

export default function registerGridBlock(
  editor: Editor,
  templateBlockOptions: TemplateBlockOptions,
  { gridRowClassNames, gridColumnClassNames }: GridBlockOptions
) {
  editor.DomComponents.addType(typeGridRow, {
    isComponent: isComponent(typeGridRow),
    model: {
      defaults: {
        name: 'Row',
        droppable: `[data-gjs-type="${typeGridColumn}"]`
      }
    },
    view: { ...baseView(gridRowClassNames) }
  })

  editor.DomComponents.addType(typeGridColumn, {
    isComponent: isComponent(typeGridColumn),
    model: {
      defaults: {
        name: 'Column',
        draggable: `[data-gjs-type="${typeGridRow}"]`
      }
    },
    view: { ...baseView(gridColumnClassNames) }
  })

  const gridColumnBlocks = {
    [gridColumn1BlockName]:
      templateBlockOptions.blocks[gridColumn1BlockName]?.template ||
      GridColumn1,
    [gridColumn2BlockName]:
      templateBlockOptions.blocks[gridColumn2BlockName]?.template ||
      GridColumn2,
    [gridColumn3BlockName]:
      templateBlockOptions.blocks[gridColumn3BlockName]?.template || GridColumn3
  }

  registerBlock(
    editor,
    {
      label: '1 Column',
      icon: OneColIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: gridColumn1BlockName,
      template: gridColumnBlocks[gridColumn1BlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: '2 Columns',
      icon: TwoColIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: gridColumn2BlockName,
      template: gridColumnBlocks[gridColumn2BlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: '3 Columns',
      icon: ThreeColIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: gridColumn3BlockName,
      template: gridColumnBlocks[gridColumn3BlockName]
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Statics',
    gridColumnBlocks,
    templateBlockOptions.blocks
  )

  return allBlocks
}
