import { Editor } from 'grapesjs'

import { BASICS_BLOCK_CATEGORY } from 'components/InstantMarketing/Builder/constants'

import ShareIcon from 'assets/images/marketing/editor/blocks/share.png'

import registerBlock from '../../registerBlock'
import { baseView, isComponent } from '../utils'
import SocialGroup from './social-group.njk'
import { TemplateBlocks } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

const typeSocialGroup = 'social-group'
const typeSocialLink = 'social-link'
const typeSocialIcon = 'social-icon'

export const socialGroupBlockName = typeSocialGroup

const socialImages = {
  Facebook: 'https://i.ibb.co/qr5rZym/facebook.png',
  Instagram: 'https://i.ibb.co/HC5KTG1/instagram.png',
  LinkedIn: 'https://i.ibb.co/kxjXJ5B/linkedin.png',
  Twitter: 'https://i.ibb.co/7WkrhZV/twitter.png',
  YouTube: 'https://i.ibb.co/8jd2Jyc/youtube.png'
}

export const socialGroupBlockTraits = {
  [typeSocialLink]: [
    {
      type: 'select',
      label: 'Icon',
      name: 'title',
      options: ['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'YouTube']
    },
    {
      type: 'text',
      label: 'Link',
      name: 'href'
    }
  ]
}

export interface SocialGroupBlockOptions {
  socialGroupClassNames?: string
  socialLinkClassNames?: string
  socialIconClassNames?: string
}

export default function registerSocialGroupBlock(
  editor: Editor,
  templateBlocks: TemplateBlocks,
  {
    socialGroupClassNames,
    socialLinkClassNames,
    socialIconClassNames
  }: SocialGroupBlockOptions
) {
  editor.DomComponents.addType(typeSocialGroup, {
    isComponent: isComponent(typeSocialGroup),
    model: {
      defaults: {
        name: 'Social Group',
        droppable: `[data-gjs-type="${typeSocialLink}"]`
      }
    },
    view: { ...baseView(socialGroupClassNames) }
  })

  function updateIconModel(model) {
    const title = model.getAttributes().title
    const socialIconModel = model.find(`[data-gjs-type="${typeSocialIcon}"]`)[0]

    if (socialIconModel) {
      socialIconModel.addAttributes({
        alt: title,
        src: socialImages[title]
      })
    }
  }

  editor.DomComponents.addType(typeSocialLink, {
    isComponent: isComponent(typeSocialLink),
    model: {
      defaults: {
        name: 'Social Link',
        draggable: `[data-gjs-type="${typeSocialGroup}"]`,
        droppable: false
      },
      init() {
        this.on('change:attributes:title', this.handleTitleChange)
      },
      handleTitleChange() {
        // update the alt and title of the icon model
        updateIconModel(this)
      }
    },
    view: {
      ...baseView(socialLinkClassNames),
      onRender() {
        // update the alt and src attributes if the icon model on first render
        if (!this.initIconModelUpdated) {
          updateIconModel(this.model)
          this.initIconModelUpdated = true
        }
      }
    }
  })

  editor.DomComponents.addType(typeSocialIcon, {
    isComponent: isComponent(typeSocialIcon),
    model: {
      defaults: {
        selectable: false,
        hoverable: false,
        layerable: false,
        droppable: false,
        draggable: false
      }
    },
    view: { ...baseView(socialIconClassNames) }
  })

  const socialGroupBlocks = {
    [socialGroupBlockName]:
      templateBlocks[socialGroupBlockName]?.template || SocialGroup
  }

  registerBlock(
    editor,
    {
      label: 'Social Group',
      icon: ShareIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: socialGroupBlockName,
      template: socialGroupBlocks[socialGroupBlockName]
    },
    templateBlocks[socialGroupBlockName]
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Statics',
    socialGroupBlocks,
    templateBlocks
  )

  return allBlocks
}
