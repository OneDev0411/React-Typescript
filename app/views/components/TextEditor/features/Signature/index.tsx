import { useState, useContext, useLayoutEffect } from 'react'

import { Box } from '@material-ui/core'
import { ContentBlock } from 'draft-js'
import { Options as ExportOptions } from 'draft-js-import-html'
import { useSelector } from 'react-redux'

import useNotify from '@app/hooks/use-notify'
import { selectImpersonateUserIsActive } from '@app/selectors/user'
import { useLatestValueRef } from 'hooks/use-latest-value-ref'

import { Checkbox } from '../../../Checkbox'
import ConfirmationModalContext from '../../../ConfirmationModal/context'
import { ToolbarFragment } from '../../components/ToolbarFragment'
import { EditorContext } from '../../editor-context'
import { useEditorPlugins } from '../../hooks/use-editor-plugins'

import createSignaturePlugin from './draft-js-signature-plugin'

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

  stateFromHtmlOptions: ExportOptions
}

export function SignatureFeature({
  signature,
  onEditSignature,
  stateFromHtmlOptions,
  hasSignatureByDefault
}: Props) {
  const notify = useNotify()
  const confirmation = useContext(ConfirmationModalContext)
  const { editorState, setEditorState } = useContext(EditorContext)
  const [isWaitingToActive, setIsaitingToActive] = useState(false)
  const isImpersonateUserActive = useSelector(selectImpersonateUserIsActive)
  const signatureRef = useLatestValueRef(signature)

  const { signaturePlugin } = useEditorPlugins(
    () => ({
      signaturePlugin: createSignaturePlugin({
        signatureContent: () => signatureRef.current || '',
        stateFromHtmlOptions,
        prependSignatureWithSeparator: false
      })
    }),
    [stateFromHtmlOptions]
  )

  useLayoutEffect(() => {
    if (isWaitingToActive && signature && !signaturePlugin.hasSignature()) {
      signaturePlugin.toggleSignature()
      setIsaitingToActive(false)
    }

    if (
      hasSignatureByDefault &&
      signature &&
      editorState.getCurrentContent().getPlainText().trim() === ''
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

  const handleOnChange = () => {
    if (!signature) {
      if (isImpersonateUserActive) {
        return notify({
          status: 'info',
          message: "The impersonated user doesn't have signature."
        })
      }

      setIsaitingToActive(true)

      return showNoSignatureModal()
    }

    signaturePlugin.toggleSignature()
  }

  return (
    <ToolbarFragment group="signature">
      <Box pl={0.5}>
        <Checkbox
          inputProps={{ tabIndex: 1 }}
          checked={signaturePlugin.hasSignature()}
          onChange={handleOnChange}
        >
          Signature
        </Checkbox>
      </Box>
    </ToolbarFragment>
  )
}
