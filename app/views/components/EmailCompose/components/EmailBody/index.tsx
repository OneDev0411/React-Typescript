import React, { ReactNode, RefObject, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { EditorState } from 'draft-js'
import { Options as ImportOptions } from 'draft-js-import-html'

import { TextEditor } from 'components/TextEditor'
import Loading from 'components/LoadingContainer'
import { IAppState } from 'reducers'
import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import { useUploadAttachment } from '../../helpers/use-upload-attachment'
import { EditEmailSignatureDrawer } from '../../../EditEmailSignatureDrawer'
import { TextEditorProps, TextEditorRef } from '../../../TextEditor/types'
import { EmailEditorFeatures } from './EmailEditorFeatures'

interface Props {
  content?: string
  hasStaticBody?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean
  autofocus?: boolean
  DraftEditorProps?: TextEditorProps['DraftEditorProps']
  editorRef?: RefObject<TextEditorRef>
  onChangeEditor: (state: EditorState) => void
  editorState: EditorState
  stateFromHtmlOptions: ImportOptions
  /**
   * we receive attachments as a prop, instead of rendering it after the email
   * body, to include it in the scroll area of the email content
   */
  attachments?: ReactNode
  uploadAttachment?: typeof uploadEmailAttachment
}

const EmailBody = ({
  content,
  hasSignatureByDefault,
  hasTemplateVariables,
  hasStaticBody = false,
  attachments = null,
  autofocus = false,
  DraftEditorProps = {},
  uploadAttachment = uploadEmailAttachment,
  editorRef,
  onChangeEditor,
  editorState,
  stateFromHtmlOptions
}: Props) => {
  const [signatureEditorVisible, setSignatureEditorVisible] = useState(false)
  const [upload] = useUploadAttachment(uploadAttachment)

  const signature = useSelector<IAppState, string>(
    state => state.user.email_signature
  )

  const uploadImage = useCallback(
    async file => {
      const response = await uploadAttachment(file)
      const uploadedFile: IFile = response.body.data

      return uploadedFile.url
    },
    [uploadAttachment]
  )

  return (
    <>
      {hasStaticBody ? (
        <>
          {content ? (
            <>
              <iframe
                title="email body"
                width="100%"
                srcDoc={content}
                style={{
                  border: '0',
                  flex: '1'
                }}
              />
              {attachments}
            </>
          ) : (
            <Loading style={{ margin: 'auto' }} />
          )}
        </>
      ) : (
        <TextEditor
          autofocus={autofocus}
          onAttachmentDropped={upload}
          DraftEditorProps={DraftEditorProps}
          appendix={attachments}
          ref={editorRef}
          onChange={onChangeEditor}
          editorState={editorState}
        >
          <EmailEditorFeatures
            uploadImage={uploadImage}
            hasTemplateVariables={hasTemplateVariables}
            signature={signature}
            hasSignatureByDefault={hasSignatureByDefault}
            stateFromHtmlOptions={stateFromHtmlOptions}
            onEditSignature={() => setSignatureEditorVisible(true)}
          />
        </TextEditor>
      )}
      <EditEmailSignatureDrawer
        isOpen={signatureEditorVisible}
        onClose={() => setSignatureEditorVisible(false)}
      />
    </>
  )
}

export default EmailBody
