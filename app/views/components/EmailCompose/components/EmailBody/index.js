import { Field } from 'react-final-form'

import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import { TextEditor } from 'components/TextEditor'
import Loading from 'components/LoadingContainer'

export default function EmailBody({ content, hasStaticBody = false }) {
  return (
    <>
      {hasStaticBody === false && (
        <Field name="body" defaultValue={content} component={TextEditor} />
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

EmailBody.propTypes = {
  hasStaticBody: PropTypes.bool,
  content: PropTypes.string
}
