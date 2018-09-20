import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import arrayMutators from 'final-form-arrays'
import { Form } from 'react-final-form'
import { FORM_ERROR } from 'final-form'

import { createContacts } from '../../../../../../store_actions/contacts/create-contacts'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import { defaultQuery } from '../../../../../../models/contacts/helpers/default-query'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import {
  TextField,
  Select
} from '../../../../../../views/components/final-form-fields'
import Alert from '../../../Partials/Alert'

import { Emails } from './Emails'
import { Phones } from './Phones'
import { Wrapper, FormContainer, Footer } from './styled-components/form'

function getDefaultOptions(options) {
  return options.map(value => ({
    title: value,
    value
  }))
}

const INITIAL_VALUES = {
  first_name: '',
  last_name: '',
  middle_name: '',
  email: [{ label: { title: 'Personal', value: 'Personal' } }],
  phone_number: [{ label: { title: 'Mobile', value: 'Mobile' } }],
  title: { title: '-Select-', value: '-Select-' }
}

class NewContactForm extends Component {
  preSaveFormat = values => {
    const attributes = []
    const { attributeDefs } = this.props
    const selectFields = ['title']
    const multipleFields = ['email', 'phone_number']
    const textFields = ['first_name', 'middle_name', 'last_name']

    const sourceTypeDef = selectDefinitionByName(attributeDefs, 'source_type')

    if (sourceTypeDef) {
      attributes.push({
        text: 'ExplicitlyCreated',
        attribute_def: sourceTypeDef.id
      })
    }

    textFields.forEach(field => {
      if (values[field]) {
        const attribute_def = selectDefinitionByName(attributeDefs, field)

        if (attribute_def) {
          attributes.push({
            text: values[field],
            attribute_def: attribute_def.id
          })
        }
      }
    })

    selectFields.forEach(field => {
      const attribute_def = selectDefinitionByName(attributeDefs, field)
      const text = (values[field] && values[field].value) || values[field]

      if (attribute_def && text && text !== '-Select-') {
        attributes.push({
          text,
          attribute_def: attribute_def.id
        })
      }
    })

    multipleFields.forEach(field => {
      const attribute_def = selectDefinitionByName(attributeDefs, field)

      if (attribute_def) {
        values[field].forEach(({ label, text }, index) => {
          if (text && label && label.value) {
            attributes.push({
              text,
              label: label.value,
              index: index + 1,
              is_primary: index === 0,
              attribute_def: attribute_def.id
            })
          }
        })
      }
    })

    return attributes
  }

  // todo: handle submit error
  handleOnSubmit = async values => {
    const isEmptyTextField = fieldName =>
      !values[fieldName] || !values[fieldName].trim()
    const isEmptySelectField = fieldName =>
      values[fieldName].value === '-Select-'
    const isEmptyFieldArray = fields =>
      fields.every(field => !field.text || !field.text.trim())

    if (
      isEmptySelectField('title') &&
      isEmptyTextField('first_name') &&
      isEmptyTextField('middle_name') &&
      isEmptyTextField('last_name') &&
      isEmptyFieldArray(values.email) &&
      isEmptyFieldArray(values.phone_number)
    ) {
      return {
        [FORM_ERROR]:
          'Please fill in any of the contacts profile fields to add your contact.'
      }
    }

    try {
      const attributes = this.preSaveFormat(values)
      const query = {
        ...defaultQuery,
        get: true,
        activity: false
      }

      const contacts = await this.props.createContacts(
        [{ attributes, user: this.props.user.id }],
        query
      )

      browserHistory.push(`/dashboard/contacts/${contacts.data[0].id}`)
    } catch (error) {
      throw error
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
      <Wrapper>
        <Form
          onSubmit={this.handleOnSubmit}
          mutators={{
            ...arrayMutators
          }}
          initialValues={INITIAL_VALUES}
          render={({
            form,
            pristine,
            validating,
            handleSubmit,
            submitting,
            submitError
          }) => (
            <FormContainer onSubmit={handleSubmit}>
              <div>
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
              </div>
              <Footer style={{ justifyContent: 'space-between' }}>
                {submitError && (
                  <Alert
                    type="error"
                    style={{ textAlign: 'left', marginBottom: '2em' }}
                  >
                    {submitError}
                  </Alert>
                )}
                <ActionButton
                  type="button"
                  inverse
                  onClick={() => form.reset(INITIAL_VALUES)}
                  style={{ marginRight: '1em' }}
                  disabled={submitting || pristine}
                >
                  Reset
                </ActionButton>
                <ActionButton type="submit" disabled={submitting || validating}>
                  {submitting ? 'Adding...' : 'Add'}
                </ActionButton>
              </Footer>
            </FormContainer>
          )}
        />
      </Wrapper>
    )
  }
}

function mapStateToProps(state) {
  const {
    contacts: { attributeDefs }
  } = state

  return {
    attributeDefs,
    user: state.user
  }
}

export default connect(
  mapStateToProps,
  { createContacts }
)(NewContactForm)
