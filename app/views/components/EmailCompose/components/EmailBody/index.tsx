import React, {
  ComponentProps,
  forwardRef,
  Fragment,
  ReactNode,
  RefObject,
  useCallback,
  useState
} from 'react'
import { Field, FieldProps } from 'react-final-form'
import { connect } from 'react-redux'

import { TextEditor } from 'components/TextEditor'
import Loading from 'components/LoadingContainer'
import { IAppState } from 'reducers'
import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import { UploadAttachment } from 'components/EmailCompose/fields/UploadAttachment'

import { EditEmailSignatureDrawer } from '../../../EditEmailSignatureDrawer'
import { defaultTemplateVariableSuggestions } from '../../default-template-variable-suggestions'
import { TextEditorProps, TextEditorRef } from '../../../TextEditor/types'

interface Props {
  content?: string
  hasStaticBody?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean
  autofocus?: boolean
  FieldProps?: Partial<FieldProps<any>>
  signature: string
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
  signature,
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
              defaultValue={content}
              {...FieldProps || {}}
              render={({ input, meta }) => (
                <TextEditor
                  enableImage
                  autofocus={autofocus}
                  uploadImage={uploadImage}
                  enableSignature
                  onAttachmentDropped={upload}
                  DraftEditorProps={DraftEditorProps}
                  hasSignatureByDefault={hasSignatureByDefault}
                  enableTemplateVariables={hasTemplateVariables}
                  templateVariableSuggestionGroups={
                    defaultTemplateVariableSuggestions
                  }
                  onEditSignature={() => setSignatureEditorVisible(true)}
                  signature={signature}
                  appendix={attachments}
                  input={input}
                  ref={editorRef}
                />
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
          />{' '}
        </>
      )}
    </UploadAttachment>
  )
}

// TODO(after-redux-update): replace this workaround for forwarding ref
// with { forwardRef: true } option in new react-redux
const ConnectedBody = connect(({ user }: IAppState) => ({
  signature: user.email_signature
}))(EmailBody)

export default forwardRef(
  (
    props: ComponentProps<typeof ConnectedBody>,
    ref: RefObject<TextEditorRef>
  ) => {
    return <ConnectedBody {...props} editorRef={ref} />
  }
)
