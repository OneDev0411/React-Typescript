import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Field } from 'react-final-form'

import { FinalFormDrawer } from '../FinalFormDrawer'
import { TextInput } from '../Forms/TextInput'
import { MultipleContactsSelect } from '../Forms/MultipleContactsSelect'

class EmailCompose extends React.Component {
  get InitialValues() {
    return {
      from: this.props.user.email,
      recipients: this.props.recipients
    }
  }

  render() {
    return (
      <FinalFormDrawer
        isOpen={this.props.isOpen}
        initialValues={this.InitialValues}
        onClose={this.props.onClose}
        onSubmit={this.props.onClickSend}
        submitting={this.props.isSubmitting}
        showReset={false}
        submitButtonLabel="Send"
        submittingButtonLabel="Sending ..."
        title="New Message"
        render={() => (
          <Fragment>
            <Field
              placeholder="From"
              name="from"
              readOnly
              component={TextInput}
            />

            <Field placeholder="Subject" name="subject" component={TextInput} />

            <Field
              placeholder="BCC"
              name="recipients"
              component={MultipleContactsSelect}
            />

            <iframe
              title="nothing"
              style={{
                border: 'none',
                width: 'calc(100% - 40px)',
                height: '200px',
                margin: '20px'
              }}
              src={`data:text/html;charset=utf-8,${encodeURI(this.props.html)}`}
            />
          </Fragment>
        )}
      />
    )
  }
}

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(EmailCompose)
