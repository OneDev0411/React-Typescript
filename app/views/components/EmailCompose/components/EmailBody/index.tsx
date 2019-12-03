import React, {
  Fragment,
  ReactNode,
  RefObject,
  useCallback,
  useState
} from 'react'
import { Field, FieldProps } from 'react-final-form'
import { useSelector } from 'react-redux'

import { TextEditor } from 'components/TextEditor'
import Loading from 'components/LoadingContainer'
import { IAppState } from 'reducers'
import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import { UploadAttachment } from 'components/EmailCompose/fields/UploadAttachment'

import { EditEmailSignatureDrawer } from '../../../EditEmailSignatureDrawer'
import { TextEditorProps, TextEditorRef } from '../../../TextEditor/types'
import { EmailEditorFeatures } from './EmailEditorFeatures'

interface Props {
  content?: string
  hasStaticBody?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean
  autofocus?: boolean
  FieldProps?: Partial<FieldProps<any>>
  DraftEditorProps?: TextEditorProps['DraftEditorProps']
  editorRef?: RefObject<TextEditorRef>
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
  FieldProps,
  autofocus = false,
  DraftEditorProps = {},
  uploadAttachment = uploadEmailAttachment,
  editorRef
}: Props) => {
  const [signatureEditorVisible, setSignatureEditorVisible] = useState(false)

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
    <UploadAttachment uploadAttachment={uploadAttachment}>
      {({ upload }) => (
        <>
          {!hasStaticBody && (
            <Field
              name="body"
              {...FieldProps || {}}
              render={({ input, meta }) => (
                <TextEditor
                  autofocus={autofocus}
                  onAttachmentDropped={upload}
                  DraftEditorProps={DraftEditorProps}
                  appendix={attachments}
                  input={input}
                  ref={editorRef}
                >
                  <EmailEditorFeatures
                    uploadImage={uploadImage}
                    hasTemplateVariables={hasTemplateVariables}
                    signature={signature}
                    hasSignatureByDefault={hasSignatureByDefault}
                    onEditSignature={() => setSignatureEditorVisible(true)}
                  />
                </TextEditor>
              )}
            />
          )}
          {hasStaticBody && (
            <Fragment>
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
            </Fragment>
          )}
          <EditEmailSignatureDrawer
            isOpen={signatureEditorVisible}
            onClose={() => setSignatureEditorVisible(false)}
          />
        </>
      )}
    </UploadAttachment>
  )
}

export default EmailBody
