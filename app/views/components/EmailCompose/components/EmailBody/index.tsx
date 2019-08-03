import { Field } from 'react-final-form'

import React, {
  ComponentProps,
  forwardRef,
  Fragment,
  Ref,
  useState
} from 'react'
import PluginsEditor from 'draft-js-plugins-editor'
import { connect } from 'react-redux'

import { TextEditor } from 'components/TextEditor'
import Loading from 'components/LoadingContainer'
import { IAppState } from 'reducers/index'

import { EditEmailSignatureDrawer } from '../../../EditEmailSignatureDrawer'
import { defaultTemplateVariableSuggestions } from '../../EmailComposeDrawer/default-template-variable-suggestions'

interface Props {
  uploadImage: (file: File) => Promise<string>
  content?: string
  hasStaticBody?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean
  signature: string
  editorRef?: Ref<PluginsEditor>
}

const EmailBody = ({
  content,
  uploadImage,
  signature,
  hasSignatureByDefault,
  hasTemplateVariables,
  hasStaticBody = false,
  editorRef
}: Props) => {
  const [signatureEditorVisible, setSignatureEditorVisible] = useState(false)

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
