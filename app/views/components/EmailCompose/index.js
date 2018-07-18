import React, { Fragment } from 'react'
import { Field } from 'react-final-form'

import { FinalFormDrawer } from '../FinalFormDrawer'
import { TextInput } from '../Forms/TextInput'

class EmailCompose extends React.Component {
  render() {
    return (
      <FinalFormDrawer
        isOpen={false}
        onClose={() => null}
        onSubmit={() => null}
        submitting={false}
        title="New Message"
        render={values => (
          <Fragment>
            <Field placeholder="From" name="xxx" component={TextInput} />
          </Fragment>
        )}
      />
    )
  }
}

export default EmailCompose
