import { createStyles, makeStyles, Theme } from '@material-ui/core'

import React, { CSSProperties, forwardRef } from 'react'

import { TextEditor } from 'components/TextEditor'
import { TextEditorProps } from 'components/TextEditor/types'
import { defaultTemplateVariableSuggestions } from 'components/EmailCompose/default-template-variable-suggestions'
import { nativelyStopEventPropagationOfEventViaRef } from 'utils/natively-stop-event-propagation-of-event-via-ref'

import { TemplateExpressionsFeature } from '../../../../TextEditor/features/TemplateExpressions'
import { RichTextFeature } from '../../../../TextEditor/features/RichText'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        overflow: 'visible',
        pointerEvents: 'none'
      },
      content: ({ targetStyle }) => ({
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
        marginTop: '-41px!important',
        pointerEvents: 'initial',
        background: '#fff',
        boxShadow: theme.shadows[5],
        // This is a super hacky fragile temporary solution until #3660 is fixed
        '& span[title="Emoji (:)"], & span[title="Emoji (:)"] + span': {
          display: 'none'
        }
      }
    }),
  { name: 'McTextEditor' }
)

interface Props
  extends Pick<TextEditorProps, 'onChange' | 'defaultValue' | 'textAlignment'> {
  targetStyle: CSSProperties
}

export const McTextEditor = forwardRef(function McTextEditor(
  { targetStyle, ...textEditorProps }: Props,
  ref
) {
  const classes = useStyles({ targetStyle })

  return (
    <TextEditor
      ref={ref}
      toolbarRef={nativelyStopEventPropagationOfEventViaRef('mousedown', true)}
      minHeight={false}
      autofocus
      placeholder=""
      classes={classes}
      {...textEditorProps}
    >
      <RichTextFeature lists={false} textSize={false} />
      <TemplateExpressionsFeature
        templateVariableSuggestionGroups={defaultTemplateVariableSuggestions}
      />
    </TextEditor>
  )
})
