import React, {
  ComponentProps,
  forwardRef,
  Fragment,
  Ref,
  useCallback,
  useState
} from 'react'
import { Field } from 'react-final-form'
import PluginsEditor from 'draft-js-plugins-editor'
import { connect } from 'react-redux'

import { TextEditor } from 'components/TextEditor'
import Loading from 'components/LoadingContainer'
import { IAppState } from 'reducers/index'
import { uploadEmailAttachment } from 'models/email-compose/upload-email-attachment'

import { EditEmailSignatureDrawer } from '../../../EditEmailSignatureDrawer'
import { defaultTemplateVariableSuggestions } from '../../EmailComposeDrawer/default-template-variable-suggestions'
import { TextEditorProps } from '../../../TextEditor/types'

interface Props {
  content?: string
  hasStaticBody?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean
  signature: string
  DraftEditorProps?: TextEditorProps['DraftEditorProps']
  editorRef?: Ref<PluginsEditor>
}

const EmailBody = ({
  content,
  signature,
  hasSignatureByDefault,
  hasTemplateVariables,
  hasStaticBody = false,
  DraftEditorProps = {},
  editorRef
}: Props) => {
  const [signatureEditorVisible, setSignatureEditorVisible] = useState(false)

  const uploadImage = useCallback(async file => {
    const uploadedFile = await uploadEmailAttachment(file)

    return uploadedFile.url
  }, [])

  return (
    <>
      {!hasStaticBody && (
        <Field
          name="body"
          defaultValue={content}
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
              input={input}
              ref={editorRef}
            />
          )}
        />
      )}
      {hasStaticBody && (
        <Fragment>
          {content ? (
            <iframe
              title="email body"
              width="100%"
              srcDoc={content}
              style={{
                border: '0',
                height: '50vh'
              }}
            />
          ) : (
            <Loading />
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
