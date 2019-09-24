import React, {
  ComponentProps,
  forwardRef,
  Fragment,
  ReactNode,
  Ref,
  useCallback,
  useState
} from 'react'
import { Field, FieldProps } from 'react-final-form'
import PluginsEditor from 'draft-js-plugins-editor'
import { connect } from 'react-redux'

import { TextEditor } from 'components/TextEditor'
import Loading from 'components/LoadingContainer'
import { IAppState } from 'reducers'
import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import { EditEmailSignatureDrawer } from '../../../EditEmailSignatureDrawer'
import { defaultTemplateVariableSuggestions } from '../../default-template-variable-suggestions'
import { TextEditorProps } from '../../../TextEditor/types'

interface Props {
  content?: string
  hasStaticBody?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean
  FieldProps?: Partial<FieldProps<any>>
  signature: string
  DraftEditorProps?: TextEditorProps['DraftEditorProps']
  editorRef?: Ref<PluginsEditor>
  /**
   * we receive attachments as a prop, instead of rendering it after the email
   * body, to include it in the scroll area of the email content
   */
  attachments?: ReactNode
}

const EmailBody = ({
  content,
  signature,
  hasSignatureByDefault,
  hasTemplateVariables,
  hasStaticBody = false,
  attachments = null,
  FieldProps,
  DraftEditorProps = {},
  editorRef
}: Props) => {
  const [signatureEditorVisible, setSignatureEditorVisible] = useState(false)

  const uploadImage = useCallback(async file => {
    const response = await uploadEmailAttachment(file)
    const uploadedFile: IFile = response.body.data

    return uploadedFile.url
  }, [])

  return (
    <>
      {!hasStaticBody && (
        <Field
          name="body"
          defaultValue={content}
          {...FieldProps || {}}
          render={({ input, meta }) => (
            <TextEditor
              enableImage
              uploadImage={uploadImage}
              enableSignature
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
  )
}

// TODO(after-redux-update): replace this workaround for forwarding ref
// with { forwardRef: true } option in new react-redux
const ConnectedBody = connect(({ user }: IAppState) => ({
  signature: user.email_signature
}))(EmailBody)

export default forwardRef(
  (props: ComponentProps<typeof ConnectedBody>, ref: Ref<PluginsEditor>) => {
    return <ConnectedBody {...props} editorRef={ref} />
  }
)
