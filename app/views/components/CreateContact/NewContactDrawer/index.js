import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import arrayMutators from 'final-form-arrays'
import { Form } from 'react-final-form'
import { browserHistory } from 'react-router'
import { Box, Button } from '@material-ui/core'
import { addNotification as notify } from 'reapop'

import { createContacts } from 'models/contacts/create-contacts'
import { defaultQuery } from 'models/contacts/helpers/default-query'

import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import Drawer from 'components/OverlayDrawer'
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
  user: PropTypes.shape().isRequired,
  showAddAnother: PropTypes.bool
}
const defaultProps = {
  section: '',
  submitCallback: null,
  showAddAnother: true
}

class NewContactDrawer extends React.Component {
  state = {
    submitError: '',
    isSubmitting: false
  }

  onClose = () => {
    this.setState({ submitError: '' }, this.props.onClose)
  }

  onSubmit = async (
    values,
    form,
    formState,
    reInitializeAfterSubmit = false
  ) => {
    const { submitCallback } = this.props

    if (this.state.submitError) {
      this.setState({ submitError: '' })
    }

    const submitError = submitValidate(values)

    if (submitError) {
      this.setState({ submitError })

      return
    }

    this.setState({ isSubmitting: true })

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

      this.setState({ isSubmitting: false })

      if (reInitializeAfterSubmit) {
        if (submitCallback) {
          submitCallback(contact)
        }

        this.props.dispatch(
          notify({
            message: 'The contact saved!',
            status: 'success'
          })
        )

        form.reset()
      } else {
        this.props.onClose()

        if (submitCallback) {
          submitCallback(contact)

          return
        }

        browserHistory.push(`/dashboard/contacts/${contact.id}`)
      }
    } catch (error) {
      this.setState({ isSubmitting: false, submitError: error.message })
    }
  }

  onSaveAndAddAnother = formProps => {
    if (formProps.hasValidationErrors) {
      return false
    }

    this.onSubmit(formProps.values, formProps.form, undefined, true)
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
    const { isSubmitting, submitError } = this.state
    const initValues = generateInitialValues(this.props.initValues)

    return (
      <Drawer open={this.props.isOpen} onClose={this.onClose}>
        {this.props.isOpen && (
          <Form
            mutators={{
              ...arrayMutators
            }}
            initialValues={{
              ...initValues,
              owner: this.props.user
            }}
            onSubmit={this.onSubmit}
          >
            {formProps => {
              const { mutators } = formProps

              return (
                <form
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexBasis: '100%',
                    maxHeight: '100%'
                  }}
                  id="create-contact-form"
                  onSubmit={formProps.handleSubmit}
                >
                  <Drawer.Header title="New Contact" />
                  <Drawer.Body>
                    <TextField name="first_name" label="First Name" />
                    <TextField name="last_name" label="Last Name" />
                    <TextField name="source" label="Source" />
                    <Emails
                      labels={this.getDefaultValues('email', 'labels')}
                      mutators={mutators}
                    />
                    <Phones
                      labels={this.getDefaultValues('phone_number', 'labels')}
                      mutators={mutators}
                    />
                    <Owner name="owner" user={this.props.user} />
                    {submitError && (
                      <Alert
                        type="error"
                        style={{ textAlign: 'left', marginBottom: '2em' }}
                      >
                        {submitError}
                      </Alert>
                    )}
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Box
                      width="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      {this.props.showAddAnother && (
                        <Box mr={1}>
                          <Button
                            type="button"
                            color="secondary"
                            variant="contained"
                            disabled={isSubmitting}
                            onClick={() => this.onSaveAndAddAnother(formProps)}
                          >
                            Save & Add Another
                          </Button>
                        </Box>
                      )}
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        disabled={isSubmitting}
                      >
                        Save
                      </Button>
                    </Box>
                  </Drawer.Footer>
                </form>
              )
            }}
          </Form>
        )}
      </Drawer>
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
