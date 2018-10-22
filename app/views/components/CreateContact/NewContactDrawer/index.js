import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import arrayMutators from 'final-form-arrays'
import { browserHistory } from 'react-router'

import Alert from '../../../../components/Pages/Dashboard/Partials/Alert/index.js'
import { defaultQuery } from '../../../../models/contacts/helpers/default-query'
import { createContacts } from '../../../../store_actions/contacts/create-contacts'
import { selectDefinitionByName } from '../../../../reducers/contacts/attributeDefs'
import { FinalFormDrawer } from '../../FinalFormDrawer'
import { TextField, Select } from '../../final-form-fields'

import { Emails } from './Emails'
import { Phones } from './Phones'
import { preSaveFormat, submitValidate, getDefaultOptions } from './helpers'

const propTypes = {
  section: PropTypes.string,
  submitCallback: PropTypes.func
}
const defaultProps = {
  section: '',
  submitCallback: () => {}
}

const INITIAL_VALUES = {
  first_name: '',
  last_name: '',
  middle_name: '',
  email: [{ label: { title: 'Personal', value: 'Personal' } }],
  phone_number: [{ label: { title: 'Mobile', value: 'Mobile' } }],
  title: { title: '-Select-', value: '-Select-' }
}

class NewContactDrawer extends React.Component {
  onSubmit = async values => {
    const submitError = submitValidate(values)

    if (submitError != null) {
      return submitError
    }

    try {
      const attributes = preSaveFormat(values, this.props.attributeDefs)
      const query = {
        ...defaultQuery,
        get: true,
        activity: false
      }

      const response = await this.props.dispatch(
        createContacts([{ attributes, user: this.props.user.id }], query)
      )

      const contact = response.data[0]

      this.props.onClose()

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
    return (
      <FinalFormDrawer
        formId="create-contact-form"
        initialValues={INITIAL_VALUES}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onSubmit={this.onSubmit}
        title="New Contact"
        mutators={{
          ...arrayMutators
        }}
        render={({ submitError, form }) => (
          <React.Fragment>
            <Select
              items={this.getDefaultValues('title', 'enum_values')}
              name="title"
              label="Title"
              placeholder="Title"
            />
            <TextField name="first_name" label="First Name" />
            <TextField name="middle_name" label="Middle Name" />
            <TextField name="last_name" label="Last Name" />
            <Emails
              labels={this.getDefaultValues('email', 'labels')}
              mutators={form.mutators}
            />
            <Phones
              labels={this.getDefaultValues('phone_number', 'labels')}
              mutators={form.mutators}
            />
            {submitError && (
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
