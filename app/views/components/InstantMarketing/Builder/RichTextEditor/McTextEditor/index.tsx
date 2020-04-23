import { createStyles, makeStyles, Theme } from '@material-ui/core'

import React, { CSSProperties, forwardRef, useEffect, useRef } from 'react'

import { TextEditor } from 'components/TextEditor'
import { TextEditorProps } from 'components/TextEditor/types'
import { defaultTemplateVariableSuggestions } from 'components/EmailCompose/default-template-variable-suggestions'

import { RichTextFeature } from 'components/TextEditor/features/RichText'
import { TemplateExpressionsFeature } from 'components/TextEditor/features/TemplateExpressions'
import { EmojiFeature } from '../../../../TextEditor/features/Emoji'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        overflow: 'visible',
        pointerEvents: 'none'
      },
      content: ({ targetStyle }: any) => ({
        // border color is inline with grape not our theme
        border: '3px solid #0945eb',
        pointerEvents: 'initial',
        boxSizing: 'content-box!important', // for including padding in size
        overflow: 'visible!important', // main reason: emoji popovers. Note that we don't
        // need overflow: auto here because this editor is an overlay and
        // is supposed to grow with content, there is no height restriction
        // from ascendants
        ...targetStyle
      }),
      dropzone: {
        border: 'none'
      },
      toolbar: {
        /**
         * with `position: fixed`:
         *  - it will stay on top of the header.
         *  - it will occupy only the required width to fit all toolbar content
         * without `position: fixed`:
         *  - It will not overflow the canvas, and therefore it will go behind
         *    the header
         *  - It will occupy the full available width (block display).
         */
        position: 'fixed',
        zIndex: 1,
        marginTop: '-41px !important',
        pointerEvents: 'initial',
        background: '#fff',
        boxShadow: theme.shadows[5]
      }
    }),
  { name: 'McTextEditor' }
)

interface Props
  extends Pick<
    TextEditorProps,
    'onChange' | 'defaultValue' | 'textAlignment' | 'editorState'
  > {
  targetStyle: CSSProperties
}

export const McTextEditor = forwardRef(function McTextEditor(
  { targetStyle, ...textEditorProps }: Props,
  ref
) {
  const classes = useStyles({ targetStyle })
  const editorToolbarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (editorToolbarRef.current) {
      editorToolbarRef.current.addEventListener('mousedown', e => {
        // To prevent formatting buttons like "Bold" button from blurring the
        // editor
        e.preventDefault()
      })
    }
  }, [])

  useOverlayCloseBugFix()

  return (
    <TextEditor
      ref={ref}
      toolbarRef={editorToolbarRef}
      minHeight={false}
      autofocus
      placeholder=""
      classes={classes}
      {...textEditorProps}
    >
      <RichTextFeature lists={false} textSize={false} />
      <EmojiFeature />
      <TemplateExpressionsFeature
        templateVariableSuggestionGroups={defaultTemplateVariableSuggestions}
      />
    </TextEditor>
  )
})

/**
 * ## Problem:
 *
 * In grape.js, a mousedown handler is set on document which closes RTE.
 * here is the code: https://github.com/artf/grapesjs/blob/84eecaedc5f0693e4e43db7f523913c79443898a/src/dom_components/view/ComponentTextView.js#L178
 * This causes problems for overlays opened by different features in the editor.
 * In fact, clicking anything in a portal outside the editor's dom node will
 * close the editor because of this listener.
 *
 * ## Solution:
 * This hook sets up a listener on document and calls stopImmediatePropagation()
 * on mousedown events. At first the idea was to call stopImmediatePropagation
 * only if the event target is within a popover (we can detect mui overlays
 * easily). But it seems unconditional call to stopImmediatePropagation doesn't
 * break anything and works fine. We can add that condition in future if we
 * found any issue with calling stopImmediatePropagation unconditionally.
 *
 * Note that we need to call `stopImmediatePropagation` instead of
 * `stopPropagation` as we want to cancel the other event listener on
 * document.
 */
function useOverlayCloseBugFix() {
  useEffect(() => {
    const handler = e => {
      e.stopImmediatePropagation()
    }

    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])
}
