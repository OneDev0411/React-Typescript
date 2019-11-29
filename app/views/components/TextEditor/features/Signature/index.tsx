import { ContentBlock } from 'draft-js'

import { Box } from '@material-ui/core'

import React, { useContext, useLayoutEffect } from 'react'

import { useEditorPlugins } from '../../hooks/use-editor-plugins'
import createSignaturePlugin from './draft-js-signature-plugin'
import { useEditor } from '../../hooks/use-editor'
import { ToolbarFragment } from '../../components/ToolbarFragment'
import { Checkbox } from '../../../Checkbox'
import ConfirmationModalContext from '../../../ConfirmationModal/context'

interface Props {
  /**
   * Whether to include signature by default or not
   */
  hasSignatureByDefault?: boolean

  /**
   * Signature content.
   * If string is passed, it's converted to ContentBlocks via stateFromHTML
   */
  signature: ContentBlock[] | string

  /**
   * Callback to be called when signature doesn't exist and the user tries to
   * use it.
   */
  onEditSignature?: () => void
}

export function SignatureFeature({
  signature,
  onEditSignature,
  hasSignatureByDefault
}: Props) {
  const confirmation = useContext(ConfirmationModalContext)
  const { stateFromHtmlOptions, editorState, setEditorState } = useEditor()

  const { signaturePlugin } = useEditorPlugins(
    () => ({
      signaturePlugin: createSignaturePlugin({
        signatureContent: signature || '',
        stateFromHtmlOptions
      })
    }),
    [signature, stateFromHtmlOptions]
  )

  useLayoutEffect(() => {
    if (
      hasSignatureByDefault &&
      signature &&
      editorState
        .getCurrentContent()
        .getPlainText()
        .trim() === ''
    ) {
      setEditorState(signaturePlugin.modifiers.appendSignature(editorState))
    }
    // eslint-disable-next-line
  }, [signature])

  const showNoSignatureModal = () => {
    confirmation!.setConfirmationModal({
      message:
        'You don’t have an email signature yet. Would you like to create one?',
      confirmLabel: 'Set signature',
      onConfirm: onEditSignature
    })
  }

  return (
    <ToolbarFragment>
      <Box pl={0.5}>
        <Checkbox
          inputProps={{ tabIndex: 1 }}
          checked={signaturePlugin.hasSignature()}
          onChange={() =>
            signature
              ? signaturePlugin.toggleSignature()
              : showNoSignatureModal()
          }
        >
          Signature
        </Checkbox>
      </Box>
    </ToolbarFragment>
  )
}
