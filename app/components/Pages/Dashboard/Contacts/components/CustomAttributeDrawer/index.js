import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FinalFormDrawer } from '../../../../../../views/components/FinalFormDrawer'
import {
  TextField,
  Select,
  TextFieldArray
} from '../../../../../../views/components/final-form-fields'

import { preSaveFormat, validate } from './helpers'

import { createAttributeDefinition } from '../../../../../../store_actions/contacts/create-attribute-definition'

const propTypes = { section: PropTypes.string.isRequired }

class CustomAttributeDrawer extends React.Component {
  state = {
    submitting: false
  }

  onSubmit = async values => {
    try {
      this.setState({ submitting: true })

      await this.props.dispatch(
        createAttributeDefinition(preSaveFormat(values))
      )

      this.setState({ submitting: false }, this.props.onClose)
    } catch (error) {
      console.log(error)
      this.setState({ submitting: false })
    }
  }

  render() {
    return (
      <FinalFormDrawer
        initialValues={{
          label: '',
          section: this.props.section,
          data_type: { title: '-Select-', value: '-Select-' },
          labels: [''],
          enum_values: ['']
        }}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onSubmit={this.onSubmit}
        title="Add New Property"
        submitting={this.state.submitting}
        validate={validate}
        render={({ values }) => (
          <React.Fragment>
            <TextField label="Name" name="label" required />

            <Select
              items={[
                {
                  title:
                    'text (use this if your property is a word, number or character)',
                  value: 'text'
                },
                {
                  title: 'number (use this if your property is only a number)',
                  value: 'number'
                },
                {
                  title:
                    'date (use this if your property is a date 01/05/2018)',
                  value: 'date'
                }
              ]}
              label="Type"
              name="data_type"
              required
            />

            <TextFieldArray label="Add Label" name="labels" />

            {values.data_type.value === 'text' && (
              <TextFieldArray label="Add Value" name="enum_values" />
            )}
          </React.Fragment>
        )}
      />
    )
  }
}

CustomAttributeDrawer.propTypes = propTypes

export default connect()(CustomAttributeDrawer)
