import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import arrayMutators from 'final-form-arrays'
import { Form, Field } from 'react-final-form'

import { createContacts } from '../../../../../../models/contacts/create-contacts'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

import { Wrapper, FormContainer, Footer } from './styled-components/form'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import { TextField } from './components/TextField'
import { Select } from './components/Select'
import { Emails } from './Emails'
import { Phones } from './Phones'

const TITLES = getDefaultOptions(['Mr', 'Ms', 'Mrs', 'Miss', 'Dr'])

const STAGE_OPTIONS = getDefaultOptions([
  'General',
  'Active',
  'Past Client',
  'Qualified Lead',
  'Unqualified Lead'
])

const validate = values => {
  const errors = {}

  if (!values.first_name) {
    errors.first_name = 'Required'
  }

  if (!values.last_name) {
    errors.last_name = 'Required'
  }

  return errors
}

class NewContactForm extends Component {
  state = {
    isSubmitting: false
  }

  formatPreSave = values => {
    const attributes = []
    const { attributeDefs } = this.props
    const selectFields = ['title', 'stage']
    const multipleFields = ['email', 'phone_number']
    const textFields = ['first_name', 'middle_name', 'last_name']

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

      if (attribute_def) {
        attributes.push({
          text: values[field].value,
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

  handleOnSubmit = async values => {
    try {
      this.setState({ isSubmitting: true })

      const attributes = this.formatPreSave(values)

      const contacts = await createContacts([{ attributes }])

      browserHistory.push(`/dashboard/contacts/${contacts.data[0]}`)
    } catch (error) {
      throw error
    } finally {
      this.setState({ isSubmitting: false })
    }
  }

  render() {
    const { isSubmitting } = this.state

    return (
      <Wrapper>
        <Form
          validate={validate}
          onSubmit={this.handleOnSubmit}
          initialValues={{
            title: { title: 'Mr', value: 'Mr' },
            stage: { title: 'General', value: 'General' },
            email: [{ label: { title: 'Personal Email', value: 'Personal' } }],
            phone_number: [
              { label: { title: 'Mobile Phone', value: 'Mobile' } }
            ]
          }}
          mutators={{
            ...arrayMutators
          }}
          render={({ reset, pristine, validating, handleSubmit, mutators }) => (
            <FormContainer>
              <div>
                <Field
                  defaultOptions={TITLES}
                  component={Select}
                  name="title"
                  title="Title"
                />
                <Field
                  component={TextField}
                  isRequired
                  name="first_name"
                  title="First Name"
                />
                <Field
                  component={TextField}
                  name="middle_name"
                  title="Middle Name"
                />
                <Field
                  isRequired
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
                <ActionButton
                  onClick={reset}
                  style={{ marginRight: '1em' }}
                  disabled={isSubmitting || pristine}
                >
                  Reset
                </ActionButton>
                <ActionButton
                  disabled={isSubmitting || validating}
                  onClick={() => handleSubmit(this.handleOnSubmit)}
                >
                  {isSubmitting ? 'Adding...' : 'Add'}
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
  const { contacts: { attributeDefs } } = state

  return {
    attributeDefs
  }
}

export default connect(mapStateToProps)(NewContactForm)

function getDefaultOptions(options) {
  return options.map(item => ({
    title: item,
    value: item
  }))
}
