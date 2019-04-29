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
import { getFormValidators } from './validators'
import { getCommissionAttributes } from './helpers/get-commission-attributes'

import { Container } from './styled'

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formOptions: PropTypes.object
}

const defaultProps = {
  formOptions: {}
}

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
      saveRoleInContacts: true,
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

  handleSubmit = async (form, saveContact = true) => {
    this.formObject.saveRoleInContacts = saveContact
    form.submit()
  }

  onSubmit = async values => {
    // keeps the last object of submitted form
    const { saveRoleInContacts } = this.formObject

    this.formObject = values

    // send form to the parent
    await this.props.onFormSubmit(normalizeForm(values), saveRoleInContacts)
  }

  validate = async values => {
    const errors = {}
    const { requiredFields } = this.getFormProperties(values)
    const validators = getFormValidators(requiredFields)

    requiredFields.forEach(fieldName => {
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
          errors[fieldName] = Role.errorNames[fieldName]
        }
      })
    )

    return errors
  }

  /**
   * get error names
   */
  static get errorNames() {
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
   * get form is new record or not
   */
  get isNewRecord() {
    return !this.props.form || !this.props.form.role
  }

  getFormProperties = values => {
    const visibleFields = getVisibleFields({
      ..._.pluck(this.props, ['isFirstNameRequired', 'isLastNameRequired']),
      role: values.role,
      role_type: values.role_type
    })

    const requiredFields = getRequiredFields({
      ..._.pluck(this.props, [
        'deal',
        'dealSide',
        'isEmailRequired',
        'isCommissionRequired'
      ]),
      role: values.role,
      role_type: values.role_type,
      visibleFields
    })

    return { visibleFields, requiredFields }
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
      <Container position={this.props.formOptions.position}>
        <Form
          validate={this.validate}
          onSubmit={this.onSubmit}
          initialValues={this.getInitialValues()}
          mutators={{
            setAgent: this.setAgent
          }}
          render={formProps => {
            const { visibleFields, requiredFields } = this.getFormProperties(
              formProps.values
            )

            return (
              <FormContainer
                {...formProps}
                isSubmitting={this.props.isSubmitting}
                isNewRecord={this.isNewRecord}
                formObject={this.props.form}
                requiredFields={requiredFields}
                visibleFields={visibleFields}
                isAllowedRole={this.isAllowedRole}
                onDeleteRole={this.handleDeleteRole}
                onSubmit={this.handleSubmit}
                onClose={this.handleClose}
              />
            )
          }}
        />
      </Container>
    )
  }
}

Role.propTypes = propTypes
Role.defaultProps = defaultProps

export default Role
