import React, { createRef, CSSProperties } from 'react'
import ReactDom from 'react-dom'

import { Editor } from 'grapesjs'

import { AppTheme } from '../../../../../AppTheme'
import { McTextEditor } from './McTextEditor'
import { getTotalGrapeBlockContentPadding } from './utils/get-total-grape-block-content-padding'

export function createRichTextEditor(editor: Editor) {
  const $toolbar = (editor.RichTextEditor as any).getToolbarEl()

  $toolbar.innerHTML = ''
  $toolbar.style.backgroundColor = 'transparent'
  $toolbar.style.border = 'none'
  $toolbar.style.pointerEvents = 'none'
  // 67 is the editor toolbar height. we want it to be on top of the element
  $toolbar.style.marginTop = '-44px'

  const editorRef = createRef<any>()
  let elementColor: string | null = null

  editor.on('rteToolbarPosUpdate', pos => {
    pos.left = pos.elementLeft - pos.canvasLeft
    pos.top = pos.elementTop
  })

  const enable = (el: HTMLElement) => {
    getGrapeBlock(el).style.setProperty('outline', 'none', 'important')

    const computedStyle = getComputedStyle(el)
    const inheritedStyles: CSSProperties = {
      fontSize: computedStyle.fontSize || undefined,
      fontFamily: computedStyle.fontFamily || undefined,
      lineHeight: computedStyle.lineHeight || undefined,
      color: computedStyle.color || undefined
    }

    elementColor = el.style.color
    el.style.color = 'transparent'

    const defaultValue = el.innerHTML

    ReactDom.render(
      <AppTheme>
        <div
          style={inheritedStyles}
          onMouseDown={() => {
            console.log('mouse down on RTE')
          }}
        >
          <McTextEditor
            ref={editorRef}
            defaultValue={defaultValue}
            targetStyle={{
              width: el.offsetWidth - 6,
              padding: getTotalGrapeBlockContentPadding(el)
            }}
          />
        </div>
      </AppTheme>,
      $toolbar
    )
  }

  const disable = (el: HTMLElement) => {
    el.style.color = elementColor
    getGrapeBlock(el).style.outline = ''

    if (editorRef && editorRef.current) {
      el.innerHTML = editorRef.current.getHtml()
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
