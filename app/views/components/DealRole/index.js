import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import _ from 'underscore'

import { FormContainer } from './Form'
import { ROLE_NAMES } from '../../../components/Pages/Dashboard/Deals/utils/roles'

import { TYPE_PERSON } from './constants/role-types'

import { normalizeForm } from './helpers/normalize-form'
import getRequiredFields from './helpers/get-required-fields'
import getVisibleFields from './helpers/get-visible-fields'
import { getCommissionAttributes } from './helpers/get-commission-attributes'

import { Container } from './styled'

class Role extends React.Component {
  handleDeleteRole = () => {}

  getInitialValues = () => {
    if (!this.props.isOpen) {
      return {}
    }

    if (this.props.isSubmitting) {
      return this.formObject
    }

    this.formObject = {
      ...this.props.form,
      ...this.PreselectRole,
      ...getCommissionAttributes(this.props.form),
      role_type: this.getRoleType()
    }

    return this.formObject
  }

  getRoleType() {
    const { form } = this.props

    if (form && form.role_type) {
      return form.role_type
    }

    return TYPE_PERSON
  }

  isAllowedRole = (name, role) => {
    const dealType = this.props.deal ? this.props.deal.deal_type : null

    if (
      ((name === 'BuyerAgent' || role === 'BuyerAgent') &&
        dealType === 'Buying') ||
      ((name === 'SellerAgent' || role === 'SellerAgent') &&
        dealType === 'Selling')
    ) {
      return false
    }

    if (
      !this.props.allowedRoles ||
      (!this.isNewRecord && this.props.form.role === name)
    ) {
      return true
    }

    return this.props.allowedRoles.includes(name)
  }

  /**
   * preselect role, if there is only one allowed role to select
   */
  get PreselectRole() {
    const { form } = this.props
    const formRole = form && form.role

    if (formRole) {
      return {}
    }

    const availableRoles = ROLE_NAMES.filter(name => this.isAllowedRole(name))
    const preselectedRole = availableRoles.length === 1 && availableRoles[0]

    if (!preselectedRole) {
      return {}
    }

    return {
      role: preselectedRole
    }
  }

  onSubmit = async values => {
    // keeps the last object of submitted form
    this.formObject = values

    // send form to the parent
    await this.props.onFormSubmit(normalizeForm(values))
  }

  validate = async values => {
    const errors = {}
    const validators = this.getFormValidators(this.state.requiredFields)

    this.state.requiredFields.forEach(fieldName => {
      let value = values[fieldName]

      if (value === undefined || value === null || value.length === 0) {
        errors[fieldName] = 'Required'
      }
    })

    await Promise.all(
      _.map(values, async (fieldValue, fieldName) => {
        const validator = validators[fieldName]

        if (!validator) {
          return false
        }

        if (!errors[fieldName] && !(await validator(fieldValue))) {
          errors[fieldName] = this.errorNames[fieldName]
        }
      })
    )

    console.log(errors)
    return errors
  }

  /**
   * get error names
   */
  get errorNames() {
    return {
      legal_first_name: 'Invalid Legal First Name',
      legal_last_name: 'Invalid Legal Last Name',
      mls_id: 'Invalid MLS ID',
      company_title: 'Invalid Company',
      email: 'Invalid Email Address',
      phone_number: 'Phone Number is invalid (###)###-####',
      commission: 'Invalid Commission value'
    }
  }

  /**
   * returns Submit button's caption
   */
  get submitCaption() {
    const { isSubmitting } = this.props

    if (isSubmitting) {
      return this.isNewRecord ? 'Saving...' : 'Updating...'
    }

    return this.isNewRecord ? 'Add' : 'Update'
  }

  /**
   * get form is new record or not
   */
  get isNewRecord() {
    const { form } = this.props

    return !form || !form.role
  }

  setAgent = ([agent], state, { changeValue }) => {
    changeValue(state, 'legal_first_name', value => agent.first_name || value)
    changeValue(state, 'legal_last_name', value => agent.last_name || value)
    changeValue(state, 'mls_id', value => agent.mlsid || value)
    changeValue(state, 'email', value => agent.email || value)
    changeValue(
      state,
      'phone',
      value => agent.phone_number || agent.work_phone || value
    )
  }

  handleClose = () => {
    this.formObject = {}
    this.props.onClose()
  }

  render() {
    if (this.props.isOpen === false) {
      return false
    }

    return (
      <Container>
        <Form
          mutators={{
            setAgent: this.setAgent
          }}
          validate={this.validate}
          onSubmit={this.onSubmit}
          initialValues={this.getInitialValues()}
          render={formProps => {
            const visibleFields = getVisibleFields({
              role: formProps.values.role,
              role_type: formProps.values.role_type,
              isFirstNameRequired: this.props.isFirstNameRequired,
              isLastNameRequired: this.props.isLastNameRequired
            })

            const requiredFields = getRequiredFields({
              ..._.pluck(this.props, [
                'deal',
                'dealSide',
                'isEmailRequired',
                'isCommissionRequired'
              ]),
              role: formProps.values.role,
              role_type: formProps.values.role_type,
              visibleFields
            })

            return (
              <FormContainer
                {...formProps}
                requiredFields={requiredFields}
                visibleFields={visibleFields}
                isAllowedRole={this.isAllowedRole}
                onDeleteRole={this.handleDeleteRole}
                onClose={this.handleClose}
              />
            )
          }}
        />
      </Container>
    )
  }
}

Role.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

Role.defaultProps = {}

export default Role
