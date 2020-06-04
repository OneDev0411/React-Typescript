import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import arrayMutators from 'final-form-arrays'
import { browserHistory } from 'react-router'

import { createContacts } from 'models/contacts/create-contacts'
import { defaultQuery } from 'models/contacts/helpers/default-query'

import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import { FinalFormDrawer } from 'components/FinalFormDrawer'
import { TextField } from 'components/final-form-fields'

import Alert from '../../../../components/Pages/Dashboard/Partials/Alert'

import { Owner } from './Owner'
import { Emails } from './Emails'
import { Phones } from './Phones'
import { preSaveFormat, submitValidate, getDefaultOptions } from './helpers'
import { generateInitialValues } from './helpers/generate-initial-values'

const propTypes = {
  section: PropTypes.string,
  submitCallback: PropTypes.func,
  user: PropTypes.shape().isRequired
}
const defaultProps = {
  section: '',
  submitCallback: null
}

class NewContactDrawer extends React.Component {
  state = {
    hasSubmitError: false
  }

  onClose = () => {
    this.setState({ hasSubmitError: false })
    this.props.onClose()
  }

  onSubmit = async values => {
    if (this.state.hasSubmitError) {
      this.setState({ hasSubmitError: false })
    }

    const submitError = submitValidate(values)

    if (submitError != null) {
      this.setState({ hasSubmitError: true })

      return submitError
    }

    try {
      const attributes = preSaveFormat(values, this.props.attributeDefs)
      const query = {
        ...defaultQuery,
        get: true,
        activity: false
      }

      const response = await createContacts(
        [{ attributes, user: values.owner.id }],
        query
      )

      const contact = response.data[0]

      this.props.onClose()

      if (this.props.submitCallback) {
        this.props.submitCallback(contact)

        return
      }

      browserHistory.push(`/dashboard/contacts/${contact.id}`)
    } catch (error) {
      console.log(error)
    }
  }

  getDefaultValues = (attributeName, properyName) => {
    const attribute = selectDefinitionByName(
      this.props.attributeDefs,
      attributeName
    )

    if (!attribute || !attribute[properyName]) {
      return []
    }

    return getDefaultOptions(attribute[properyName])
  }

  render() {
    const initValues = generateInitialValues(this.props.initValues)

    return (
      <FinalFormDrawer
        formId="create-contact-form"
        initialValues={{
          ...initValues,
          owner: this.props.user
        }}
        isOpen={this.props.isOpen}
        onClose={this.onClose}
        onSubmit={this.onSubmit}
        title="New Contact"
        mutators={{
          ...arrayMutators
        }}
        render={({ submitError, form }) => (
          <React.Fragment>
            <TextField name="first_name" label="First Name" />
            <TextField name="last_name" label="Last Name" />
            <TextField name="source" label="Source" />
            <Emails
              labels={this.getDefaultValues('email', 'labels')}
              mutators={form.mutators}
            />
            <Phones
              labels={this.getDefaultValues('phone_number', 'labels')}
              mutators={form.mutators}
            />
            <Owner name="owner" user={this.props.user} />
            {this.state.hasSubmitError && submitError && (
              <Alert
                type="error"
                style={{ textAlign: 'left', marginBottom: '2em' }}
              >
                {submitError}
              </Alert>
            )}
          </React.Fragment>
        )}
      />
    )
  }
}

NewContactDrawer.propTypes = propTypes
NewContactDrawer.defaultProps = defaultProps

function mapStateToProps(state) {
  return {
    attributeDefs: state.contacts.attributeDefs,
    user: state.user
  }
}

export default connect(mapStateToProps)(NewContactDrawer)
