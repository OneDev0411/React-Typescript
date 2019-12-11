import React, { createRef, CSSProperties, useState } from 'react'
import ReactDom from 'react-dom'

import { Editor } from 'grapesjs'

import { AppTheme } from '../../../../../AppTheme'
import { McTextEditor } from './McTextEditor'
import { getTotalGrapeBlockContentPadding } from './utils/get-total-grape-block-content-padding'
import { TextEditorProps } from '../../../TextEditor/types'

const RTE_BLOCK_TYPE_BLACKLIST = ['mj-button', 'link']

function shouldOfferRTE(grapeBlockEl: HTMLElement) {
  return !RTE_BLOCK_TYPE_BLACKLIST.includes(
    grapeBlockEl.getAttribute('data-gjs-type')!
  )
}

const styles = `
.selected-editable-block {
  outline: none!important;
}
.selected-editable-block--originallyInline {
  /* for inline elements inside lists (https://gitlab.com/rechat/web/issues/3607#note_249285730) */
  display: block;
  
  /* there are sloppy templates that have vertical margin on inline elements :| so when we make it block, the margins become problematic */
  margin-top: 0!important;
  margin-bottom: 0!important;
}

.selected-editable-block *::selection {
  background: transparent;
}
.selected-editable-block, .selected-editable-block  * {
  color: transparent!important;
}
`

export function createRichTextEditor(editor: Editor) {
  const richTextEditor: any = editor.RichTextEditor
  const $toolbar = richTextEditor.getToolbarEl()

  $toolbar.innerHTML = ''
  $toolbar.style.backgroundColor = 'transparent'
  $toolbar.style.border = 'none'
  $toolbar.style.pointerEvents = 'none'
  // 67 is the editor toolbar height. we want it to be on top of the element

  const editorRef = createRef<any>()
  let outlineOffset = 0
  const borderWidth = 3
  let originalFirstChild: HTMLElement | null = null

  const doc = editor.Canvas.getFrameEl().contentDocument!
  const styleEl = doc.createElement('style')

  styleEl.innerHTML = styles
  doc.querySelector('body')!.appendChild(styleEl)

  editor.on('rteToolbarPosUpdate', pos => {
    pos.left = pos.elementLeft - borderWidth - outlineOffset

    // This is for when element exits from the top. Note that it seems it's not
    // possible to handle it with `pos.top`
    const topOffsetFix = pos.canvasTop >= pos.elementTop ? pos.elementHeight : 0

    $toolbar.style.marginTop = `${-topOffsetFix}px`
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

    const computedStyle = getComputedStyle(el)
    const inheritedStyles: CSSProperties = {
      fontSize: computedStyle.fontSize || undefined,
      fontFamily: computedStyle.fontFamily || undefined,
      fontWeight:
        (computedStyle.fontWeight as CSSProperties['fontWeight']) || undefined,
      lineHeight: computedStyle.lineHeight || undefined,
      hyphens: (computedStyle as any).hyphens || undefined,
      color: computedStyle.color || undefined
    }

    originalFirstChild =
      el.firstElementChild instanceof HTMLElement ? el.firstElementChild : null

    // it's important to add class after getting computed style to prevent
    // affecting it
    grapeBlockEl.classList.add('selected-editable-block')

    if (grapeBlockEl && getComputedStyle(grapeBlockEl).display === 'inline') {
      grapeBlockEl.classList.add('selected-editable-block--originallyInline')
    }

    const defaultValue = el.innerHTML

    const updateHeight = () => {
      setEditorContent(el, editorRef.current.getHtml())

      richTextEditor.updatePosition()
    }

    const padding = getTotalGrapeBlockContentPadding(
      originalFirstChild || el,
      outlineOffset
    )

    const alignments: TextEditorProps['textAlignment'][] = [
      'left',
      'right',
      'center'
    ]

    const body = el.closest('body')!
    const canvasStyleStr = [...body.querySelectorAll('style')]
      .map(item => item.innerHTML)
      .join('\n')

    const fontLinks = [
      ...body.querySelectorAll('link[rel="stylesheet"]')
    ].filter(
      (linkEl: HTMLLinkElement): linkEl is HTMLLinkElement =>
        linkEl.href.includes('font')
    )

    // Pure hack! we extract the font size css rules by a regexp,
    // we don't wanna inject other rules which may mess up the dom outside
    // the canvas's iframe
    const fontFaceRulesStr = (
      canvasStyleStr.match(/@font-face(.|\s)*?}/gm) || []
    ).join('\n')

    const getWidth = () => Math.ceil(el.getBoundingClientRect().width)
    const CustomEditor = () => {
      const [width, setWidth] = useState(getWidth)

      return (
        <AppTheme>
          <div>
            <McTextEditor
              ref={editorRef}
              defaultValue={defaultValue}
              onChange={() => {
                setWidth(getWidth())
                updateHeight()
              }}
              textAlignment={alignments.find(
                alignment => alignment === computedStyle.textAlign
              )}
              targetStyle={{
                width,
                padding,
                ...inheritedStyles
              }}
            />
            <style>{fontFaceRulesStr}</style>
            {fontLinks.map((link, index) => (
              <link key={index} href={link.href} rel="stylesheet" />
            ))}
          </div>
        </AppTheme>
      )
    }

    ReactDom.render(<CustomEditor />, $toolbar)
  }

  const disable = (el: HTMLElement) => {
    const grapeBlockEl = getGrapeBlock(el)

    grapeBlockEl.classList.remove('selected-editable-block')

    if (!shouldOfferRTE(grapeBlockEl)) {
      el.contentEditable = 'false'

      return
    }

    if (editorRef && editorRef.current) {
      setEditorContent(el, editorRef.current.getHtml())
    }

    ReactDom.unmountComponentAtNode($toolbar)
  }

  return {
    enable,
    disable
  }

  function setEditorContent(el: HTMLElement, content: string) {
    el.innerHTML = content

    if (
      el.firstChild === el.lastChild &&
      el.firstElementChild instanceof HTMLDivElement
    ) {
      el.innerHTML = el.firstElementChild.innerHTML
    }

    if (originalFirstChild) {
      originalFirstChild.innerHTML = el.innerHTML
      el.innerHTML = originalFirstChild.outerHTML
      // Please don't be  WAT 😂! there is some logic going on here!
    }
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
