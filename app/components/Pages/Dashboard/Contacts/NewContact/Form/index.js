import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import arrayMutators from 'final-form-arrays'
import { Form, Field } from 'react-final-form'
import { FORM_ERROR } from 'final-form'

import { createContacts } from '../../../../../../store_actions/contacts/create-contacts'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import { defaultQuery } from '../../../../../../models/contacts/helpers/default-query'

import { Wrapper, FormContainer, Footer } from './styled-components/form'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import { TextField } from './components/TextField'
import { Select } from './components/Select'
import { Emails } from './Emails'
import { Phones } from './Phones'

import Alert from '../../..//Partials/Alert'

const TITLES = getDefaultOptions(['Mr', 'Ms', 'Mrs', 'Miss', 'Dr'])

const STAGE_OPTIONS = getDefaultOptions([
  'General',
  'Active',
  'Past Client',
  'Qualified Lead',
  'Unqualified Lead'
])

class NewContactForm extends Component {
  formatPreSave = values => {
    const attributes = []
    const { attributeDefs } = this.props
    const selectFields = ['title', 'stage']
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
      const text = values[field].value

      if (attribute_def && text) {
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
    const isEmptyFieldArray = fields => fields.every(field => !field.text)

    if (
      !values.first_name &&
      !values.middle_name &&
      !values.last_name &&
      isEmptyFieldArray(values.email) &&
      isEmptyFieldArray(values.phone_number)
    ) {
      return {
        [FORM_ERROR]:
          'Please fill in any of the contacts profile fields to add your contact.'
      }
    }

    try {
      const attributes = this.formatPreSave(values)
      const query = {
        ...defaultQuery,
        get: true,
        activity: false
      }

      const contacts = await this.props.createContacts([{ attributes }], query)

      if (
        contacts &&
        Array.isArray(contacts.data) &&
        contacts.data.length === 1
      ) {
        const id = contacts.data[0].id || contacts.data[0]

        const isId = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/

        if (new RegExp(isId).test(id)) {
          browserHistory.push(`/dashboard/contacts/${id}`)
        }
      } else {
        browserHistory.push('/dashboard/contacts')
      }
    } catch (error) {
      throw error
    }
  }

  render() {
    return (
      <Wrapper>
        <Form
          onSubmit={this.handleOnSubmit}
          initialValues={{
            title: { title: '-Select-', value: null },
            stage: { title: 'General', value: 'General' },
            email: [{ label: { title: 'Personal Email', value: 'Personal' } }],
            phone_number: [
              { label: { title: 'Mobile Phone', value: 'Mobile' } }
            ]
          }}
          mutators={{
            ...arrayMutators
          }}
          render={({
            reset,
            pristine,
            validating,
            handleSubmit,
            mutators,
            submitting,
            submitError
          }) => (
            <FormContainer onSubmit={handleSubmit}>
              <div>
                <Field
                  defaultOptions={TITLES}
                  component={Select}
                  name="title"
                  title="Title"
                />
                <Field
                  component={TextField}
                  name="first_name"
                  title="First Name"
                />
                <Field
                  component={TextField}
                  name="middle_name"
                  title="Middle Name"
                />
                <Field
                  component={TextField}
                  name="last_name"
                  title="Last Name"
                />
                <Emails mutators={mutators} />
                <Phones mutators={mutators} />
                <Field
                  defaultOptions={STAGE_OPTIONS}
                  component={Select}
                  name="stage"
                  title="State"
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
                  onClick={reset}
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
    attributeDefs
  }
}

export default connect(mapStateToProps, { createContacts })(NewContactForm)

function getDefaultOptions(options) {
  return options.map(item => ({
    title: item,
    value: item
  }))
}
