import React, { createRef, CSSProperties } from 'react'
import ReactDom from 'react-dom'

import { Editor } from 'grapesjs'

import { AppTheme } from '../../../../../AppTheme'
import { McTextEditor } from './McTextEditor'
import { getTotalGrapeBlockContentPadding } from './utils/get-total-grape-block-content-padding'

const RTE_BLOCK_TYPE_BLACKLIST = ['mj-button']

function shouldOfferRTE(grapeBlockEl: HTMLElement) {
  return !RTE_BLOCK_TYPE_BLACKLIST.includes(
    grapeBlockEl.getAttribute('data-gjs-type')!
  )
}

export function createRichTextEditor(editor: Editor) {
  const richTextEditor: any = editor.RichTextEditor
  const $toolbar = richTextEditor.getToolbarEl()

  $toolbar.innerHTML = ''
  $toolbar.style.backgroundColor = 'transparent'
  $toolbar.style.border = 'none'
  $toolbar.style.pointerEvents = 'none'
  // 67 is the editor toolbar height. we want it to be on top of the element
  $toolbar.style.marginTop = '-41px'

  const editorRef = createRef<any>()
  let elementColor: string | null = null
  let outlineOffset = 0
  const borderWidth = 3

  editor.on('rteToolbarPosUpdate', pos => {
    pos.left = pos.elementLeft - pos.canvasLeft - borderWidth - outlineOffset
    pos.top = pos.elementTop - borderWidth - outlineOffset
  })

  const enable = (el: HTMLElement) => {
    const grapeBlockEl = getGrapeBlock(el)

    if (!shouldOfferRTE(grapeBlockEl)) {
      el.contentEditable = 'true'

      el.focus()

      return
    }

    outlineOffset = parseInt(getComputedStyle(grapeBlockEl).outlineOffset, 10)

    grapeBlockEl.style.setProperty('outline', 'none', 'important')

    const computedStyle = getComputedStyle(el)
    const inheritedStyles: CSSProperties = {
      fontSize: computedStyle.fontSize || undefined,
      fontFamily: computedStyle.fontFamily || undefined,
      fontWeight:
        (computedStyle.fontWeight as CSSProperties['fontWeight']) || undefined,
      lineHeight: computedStyle.lineHeight || undefined,
      color: computedStyle.color || undefined
    }

    elementColor = el.style.color
    el.style.color = 'transparent'

    const defaultValue = el.innerHTML

    const updateHeight = value => {
      el.innerHTML = value
      richTextEditor.updatePosition()
    }

    const padding = getTotalGrapeBlockContentPadding(el, outlineOffset)

    ReactDom.render(
      <AppTheme>
        <div style={inheritedStyles}>
          <McTextEditor
            ref={editorRef}
            defaultValue={defaultValue}
            onChange={updateHeight}
            targetStyle={{
              width: Math.ceil(el.getBoundingClientRect().width),
              padding
            }}
          />
          <style>
            {
              '@font-face{font-family:Gotham-Light;src:url("https://s3-us-west-2.amazonaws.com/shortlisted-test/marketing/templates/1446ae996fb919d73d2ac732f08194bbfb3987e2/1Agent-social/FallTour_InstagramPost/fonts/Gotham Light.otf") format("otf"), url("https://s3-us-west-2.amazonaws.com/shortlisted-test/marketing/templates/1446ae996fb919d73d2ac732f08194bbfb3987e2/1Agent-social/FallTour_InstagramPost/fonts/Gotham Light.otf") format("truetype");font-weight:350;font-style:normal;}'
            }
            {
              '@font-face{font-family:Gotham-Medium;src:url("https://s3-us-west-2.amazonaws.com/shortlisted-test/marketing/templates/1446ae996fb919d73d2ac732f08194bbfb3987e2/1Agent-social/FallTour_InstagramPost/fonts/Gotham Medium.otf") format("otf"), url("https://s3-us-west-2.amazonaws.com/shortlisted-test/marketing/templates/1446ae996fb919d73d2ac732f08194bbfb3987e2/1Agent-social/FallTour_InstagramPost/fonts/Gotham Medium.otf") format("truetype");font-weight:350;font-style:normal;}'
            }
            {
              '@font-face{font-family:Gotham-Book;src:url("https://s3-us-west-2.amazonaws.com/shortlisted-test/marketing/templates/1446ae996fb919d73d2ac732f08194bbfb3987e2/1Agent-social/FallTour_InstagramPost/fonts/Gotham Book.otf") format("otf"), url("https://s3-us-west-2.amazonaws.com/shortlisted-test/marketing/templates/1446ae996fb919d73d2ac732f08194bbfb3987e2/1Agent-social/FallTour_InstagramPost/fonts/Gotham Book.otf") format("truetype");font-weight:350;font-style:normal;}'
            }
          </style>
        </div>
      </AppTheme>,
      $toolbar
    )
  }

  const disable = (el: HTMLElement) => {
    const grapeBlockEl = getGrapeBlock(el)

    if (!shouldOfferRTE(grapeBlockEl)) {
      el.contentEditable = 'false'

      return
    }

    el.style.color = elementColor
    grapeBlockEl.style.outline = ''

    if (editorRef && editorRef.current) {
      el.innerHTML = editorRef.current.getHtml()

      if (
        el.firstChild === el.lastChild &&
        el.firstElementChild instanceof HTMLDivElement
      ) {
        el.innerHTML = el.firstElementChild.innerHTML
      }
    }

    ReactDom.unmountComponentAtNode($toolbar)
  }

  return {
    enable,
    disable
  }
}

/**
 * Sometimes the el passed in `enable` method of custom RTE, is a child of
 * a grape block. So we may need to navigate up to find the grape block
 * @param el
 */
function getGrapeBlock(el: HTMLElement): HTMLElement {
  return el.matches('[data-gjs-type]')
    ? el
    : (el.closest('[data-gjs-type]') as HTMLElement) || el
}
