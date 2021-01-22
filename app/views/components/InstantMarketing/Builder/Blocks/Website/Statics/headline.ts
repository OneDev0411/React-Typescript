import { Editor } from 'grapesjs'

import { BASICS_BLOCK_CATEGORY } from 'components/InstantMarketing/Builder/constants'

import Headline1Icon from 'assets/images/marketing/editor/blocks/h1.png'
import Headline2Icon from 'assets/images/marketing/editor/blocks/h2.png'

import { isComponent } from '../utils'

import Headline1 from './headline1.njk'
import Headline2 from './headline2.njk'

import registerBlock from '../../registerBlock'

const typeHeadline = 'headline'
export const headline1BlockName = `${typeHeadline}-1`
export const headline2BlockName = `${typeHeadline}-2`

export interface HeadlineBlockOptions {
  headline1ClassNames?: string
  headline2ClassNames?: string
  headline1Block?: string
  headline2Block?: string
}

const headlineNumberRegex = /[^\d](\d)$/

export default (
  editor: Editor,
  {
    headline1Block,
    headline2Block,
    headline1ClassNames,
    headline2ClassNames
  }: HeadlineBlockOptions
) => {
  editor.DomComponents.addType(typeHeadline, {
    isComponent: isComponent(typeHeadline),
    extend: 'text',
    model: {
      defaults: {
        name: 'Headline',
        number: ''
      },
      init() {
        const tagName: string = this.attributes.tagName
        const matches = tagName.match(headlineNumberRegex)

        if (matches) {
          const headlineNumber = matches[1]

          this.set('number', headlineNumber)
          this.set('name', `${this.get('name')} ${headlineNumber}`)
        }
      }
    },
    view: {
      init({ model }) {
        const headlineNumber = model.get('number')

        if (headlineNumber === '1' && headline1ClassNames) {
          model.addClass(headline1ClassNames)
        } else if (headlineNumber === '2' && headline2ClassNames) {
          model.addClass(headline2ClassNames)
        }
      }
    }
  })

  const headlineBlocks = {
    [headline1BlockName]: headline1Block || Headline1,
    [headline2BlockName]: headline2Block || Headline2
  }

  registerBlock(editor, {
    label: 'Headline 1',
    icon: Headline1Icon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: headline1BlockName,
    template: headlineBlocks[headline1BlockName]
  })

  registerBlock(editor, {
    label: 'Headline 2',
    icon: Headline2Icon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: headline2BlockName,
    template: headlineBlocks[headline2BlockName]
  })

  return headlineBlocks
}
