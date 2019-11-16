import { createStyles, makeStyles, Theme } from '@material-ui/core'

import React, { CSSProperties, forwardRef } from 'react'

import { TextEditor } from 'components/TextEditor'
import { RichTextFeature, TextEditorProps } from 'components/TextEditor/types'
import { defaultTemplateVariableSuggestions } from 'components/EmailCompose/default-template-variable-suggestions'
import { nativelyStopEventPropagationOfEventViaRef } from 'utils/natively-stop-event-propagation-of-event-via-ref'

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
        ...targetStyle
      }),
      dropzone: {
        border: 'none'
      },
      toolbar: {
        pointerEvents: 'initial',
        background: '#fff',
        boxShadow: theme.shadows[5]
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
      enableTemplateVariables
      richText={[RichTextFeature.INLINE_FORMATTING, RichTextFeature.LINK]}
      templateVariableSuggestionGroups={defaultTemplateVariableSuggestions}
      minHeight={false}
      autofocus
      classes={classes}
      {...textEditorProps}
    />
  )
})
