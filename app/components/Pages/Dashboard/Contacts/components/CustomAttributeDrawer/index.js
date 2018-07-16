import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { FinalFormDrawer } from '../../../../../../views/components/FinalFormDrawer'
import {
  TextField,
  Select,
  TextFieldArray
} from '../../../../../../views/components/final-form-fields'
import { createAttributeDefinition } from '../../../../../../store_actions/contacts/create-attribute-definition'

import { preSaveFormat, validate } from './helpers'
import { TipsBanner } from './TipsBanner'

const propTypes = { section: PropTypes.string }

const defaultSelectedItem = { title: '-Select-', value: '-Select-' }

class CustomAttributeDrawer extends React.Component {
  state = {
    initialValues: {
      label: '',
      section: this.props.section || defaultSelectedItem,
      data_type: defaultSelectedItem,
      labels: [''],
      enum_values: ['']
    }
  }

  onSubmit = async values => {
    try {
      this.setState({ initialValues: values })

      await this.props.dispatch(
        createAttributeDefinition(preSaveFormat(values))
      )

      this.props.onClose()
      this.props.dispatch(
        notify({
          status: 'success',
          dismissAfter: 4000,
          title: `Custom field added to ${this.props.section}.`,
          message: `${values.label}`
        })
      )
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <FinalFormDrawer
        initialValues={this.state.initialValues}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onSubmit={this.onSubmit}
        title="Add a Custom Field"
        validate={validate}
        render={({ values }) => (
          <React.Fragment>
            <TipsBanner />

            <TextField label="Name" name="label" required />

            <Select
              items={[
                {
                  title: 'Text',
                  value: 'text'
                },
                {
                  title: 'Number',
                  value: 'number'
                },
                {
                  title: 'Date',
                  value: 'date'
                }
              ]}
              label="Type"
              name="data_type"
              required
            />

            {!this.props.section && (
              <Select
                items={[
                  {
                    title: 'Contact Info',
                    value: 'Contact Info'
                  },
                  {
                    title: 'Details',
                    value: 'Details'
                  },
                  {
                    title: 'Dates',
                    value: 'Dates'
                  },
                  {
                    title: 'Addresses',
                    value: 'Addresses'
                  }
                ]}
                label="Section"
                name="section"
                required
              />
            )}

            {values.data_type.value !== '-Select-' && (
              <TextFieldArray
                label="Add Label"
                labelNote="(optional)"
                name="labels"
              />
            )}

            {values.data_type.value === 'text' && (
              <TextFieldArray
                label="Default Values"
                labelNote="(optional)"
                name="enum_values"
              />
            )}
          </React.Fragment>
        )}
      />
    )
  }
}

CustomAttributeDrawer.propTypes = propTypes

export default connect()(CustomAttributeDrawer)
