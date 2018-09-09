import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Field } from 'react-final-form'

import Loading from '../../../components/Partials/Loading'

import { FinalFormDrawer } from '../FinalFormDrawer'
import { TextInput } from '../Forms/TextInput'
import { MultipleContactsSelect } from '../Forms/MultipleContactsSelect'

import { EmailBody } from './styled'

class EmailCompose extends React.Component {
  get InitialValues() {
    if (
      (this.formObject && !this.isRecipientsChanged()) ||
      this.props.isSubmitting
    ) {
      return this.formObject
    }

    this.formObject = {
      from: `${this.props.user.display_name} <${this.props.user.email}>`,
      recipients: this.props.recipients || []
    }

    return this.formObject
  }

  isRecipientsChanged = () =>
    (this.formObject.recipients || []).length !==
    (this.props.recipients || []).length

  validate = values => {
    const errors = {}
    const { subject, recipients } = values

    if (!subject || subject.length === 0) {
      errors.subject = 'Please enter the subject'
    }

    if (!recipients || recipients.length === 0) {
      errors.recipients = 'You should select one recipient at least'
    }

    return errors
  }

  render() {
    return (
      <FinalFormDrawer
        isOpen={this.props.isOpen}
        initialValues={this.InitialValues}
        onClose={this.props.onClose}
        onSubmit={this.props.onClickSend}
        validate={this.validate}
        submitting={this.props.isSubmitting}
        closeDrawerOnBackdropClick={false}
        showCancel={false}
        showReset={false}
        submitButtonLabel="Send"
        submittingButtonLabel="Sending ..."
        title="New Email"
        render={() => (
          <Fragment>
            <Field
              placeholder="To"
              name="recipients"
              component={MultipleContactsSelect}
            />

            <Field
              placeholder="From"
              name="from"
              readOnly
              component={TextInput}
            />

            <Field placeholder="Subject" name="subject" component={TextInput} />

            <EmailBody>
              {this.props.html === null && <Loading />}

              <div
                dangerouslySetInnerHTML={{
                  __html: this.props.html
                }}
              />
            </EmailBody>
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
