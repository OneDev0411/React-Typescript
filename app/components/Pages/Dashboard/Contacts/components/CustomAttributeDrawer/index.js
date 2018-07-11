import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FinalFormDrawer } from '../../../../../../views/components/FinalFormDrawer'
import {
  TextField,
  Select,
  TextFieldArray
} from '../../../../../../views/components/final-form-fields'
import { createAttributeDefinition } from '../../../../../../store_actions/contacts/create-attribute-definition'

import { preSaveFormat, validate } from './helpers'
import { TipsBanner } from './TipsBanner'

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
        title="Add a Custom Field"
        submitting={this.state.submitting}
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
