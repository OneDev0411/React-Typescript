import { Field } from 'react-final-form'

import React, { forwardRef, Fragment } from 'react'

import { TextEditor } from 'components/TextEditor'
import Loading from 'components/LoadingContainer'

interface Props {
  uploadImage: (file: File) => Promise<string>
  content?: string
  hasStaticBody?: boolean
}

const EmailBody = (
  { content, uploadImage, hasStaticBody = false }: Props,
  ref
) => {
  return (
    <>
      {!hasStaticBody && (
        <Field
          name="body"
          defaultValue={content}
          render={({ input, meta }) => (
            <TextEditor
              hasImage
              uploadImage={uploadImage}
              input={input}
              ref={ref}
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
    </>
  )
}
export default forwardRef(EmailBody)
