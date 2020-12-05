import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'components/notification'

import { FinalFormDrawer } from '../../../../../../views/components/FinalFormDrawer'
import {
  TextField,
  Select,
  TextFieldArray
} from '../../../../../../views/components/final-form-fields'
import { createAttributeDefinition } from '../../../../../../store_actions/contacts/create-attribute-definition'

import { preSaveFormat, validate } from './helpers'
import { TipsBanner } from './TipsBanner'

const selectFieldDefaultSelectedItem = { title: '-Select-', value: '-Select-' }
const propTypes = {
  section: PropTypes.string,
  submitCallback: PropTypes.func
}
const defaultProps = {
  section: '',
  submitCallback: () => {}
}

const getDataTypeInitialValue = props => {
  if (props.section && props.section === 'Dates') {
    return { title: 'Date', value: 'date' }
  }

  return selectFieldDefaultSelectedItem
}

class CustomAttributeDrawer extends React.Component {
  initialValues = {
    label: '',
    section: this.props.section || selectFieldDefaultSelectedItem,
    data_type: getDataTypeInitialValue(this.props),
    labels: [''],
    enum_values: ['']
  }

  onSubmit = async values => {
    try {
      const formatedValues = preSaveFormat(values)

      const customAttribute = await this.props.dispatch(
        createAttributeDefinition(formatedValues)
      )

      this.props.onClose()
      this.props.dispatch(
        notify({
          status: 'success',
          dismissAfter: 4000,
          title: `Custom field added to ${formatedValues.section}.`,
          message: `${values.label}`
        })
      )

      this.props.submitCallback(customAttribute)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <FinalFormDrawer
        initialValues={this.initialValues}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onSubmit={this.onSubmit}
        title="Add Custom Field"
        formId="add-custom-field-form"
        validate={validate}
        render={({ values }) => (
          <React.Fragment>
            <TipsBanner />

            <TextField
              label="Name"
              name="label"
              required
              hint="A custom field name is your unique title name for your custom field. Examples of a custom title name could be Pet Name, Marital Status or Military Service."
            />

            <Select
              items={[
                {
                  title: 'Date',
                  value: 'date',
                  hint:
                    'For custom fields that are date based when capturing values like a birthday or anniversary'
                },
                {
                  title: 'Number',
                  value: 'number',
                  hint:
                    "For custom fields that are ONLY number based like 'Age' or 'Years retired'"
                },
                {
                  title: 'Text',
                  value: 'text',
                  hint:
                    'For custom fields that can accept words, numbers and characters and have unique values and labels'
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
                    title: 'Touch Dates',
                    value: 'Dates'
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
                hint="Use labels to add dropdown descriptions to the values you want to capture. For example, use the labels work, home & personal when capturing a phone number."
              />
            )}

            {values.data_type.value === 'text' && (
              <TextFieldArray
                label="Default Values"
                labelNote="(optional)"
                name="enum_values"
                hint="Use values to add dropdown options to the custom field you want to capture. For example, use the values Mr., Mrs. or Dr. when capturing a title."
              />
            )}
          </React.Fragment>
        )}
      />
    )
  }
}

CustomAttributeDrawer.propTypes = propTypes
CustomAttributeDrawer.defaultProps = defaultProps

export default connect()(CustomAttributeDrawer)
