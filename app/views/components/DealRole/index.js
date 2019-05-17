import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'

import { ROLE_NAMES } from 'deals/utils/roles'

import { FormContainer } from './Form'

import { TYPE_PERSON } from './constants/role-types'

import { normalizeForm } from './helpers/normalize-form'
import getRequiredFields from './helpers/get-required-fields'
import getVisibleFields from './helpers/get-visible-fields'
import { getFormValidators } from './validators'
import { getCommissionAttributes } from './helpers/get-commission-attributes'

import { Container, Overlay } from './styled'

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  deal: PropTypes.object.isRequired,
  form: PropTypes.object,
  allowedRoles: PropTypes.array,
  formOptions: PropTypes.object,
  isRoleRemovable: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isCommissionRequired: PropTypes.bool,
  showOverlay: PropTypes.bool
}

const defaultProps = {
  form: null,
  formOptions: {},
  isRoleRemovable: false,
  isSubmitting: false,
  isCommissionRequired: false,
  showOverlay: true,
  allowedRoles: []
}

class Role extends React.Component {
  getInitialValues = () => {
    if (!this.props.isOpen) {
      return {}
    }

    if (this.props.isSubmitting) {
      return this.formObject
    }

    const { form } = this.props

    this.formObject = {
      saveRoleInContacts: true,
      ...form,
      ...this.PreselectRole,
      ...getCommissionAttributes(form),
      role_type: this.getRoleType(),
      mls_id: form && form.agent ? form.agent.mlsid : ''
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
      return {
        role: formRole
      }
    }

    const availableRoles = ROLE_NAMES.filter(name => this.isAllowedRole(name))
    const preselectedRole = availableRoles.length === 1 && availableRoles[0]

    return {
      role: preselectedRole || null
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
    try {
      await this.props.onFormSubmit(normalizeForm(values), saveRoleInContacts)
    } catch (e) {
      console.log(e)
    }
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
      Object.entries(values).map(async ([fieldName, fieldValue]) => {
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
    const { props } = this

    const shared = {
      role: values.role,
      role_type: values.role_type
    }

    const visibleFields = getVisibleFields({
      isFirstNameRequired: props.isFirstNameRequired,
      isLastNameRequired: props.isLastNameRequired,
      ...shared
    })

    const requiredFields = getRequiredFields({
      deal: props.deal,
      dealSide: props.dealSide,
      isEmailRequired: props.isEmailRequired,
      isCommissionRequired: props.isCommissionRequired,
      visibleFields,
      ...shared
    })

    return { visibleFields, requiredFields }
  }

  populateRole = ([user], state, { changeValue }) => {
    changeValue(state, 'legal_first_name', value => user.first_name || value)
    changeValue(state, 'legal_last_name', value => user.last_name || value)
    changeValue(state, 'email', value => user.email || value)
    changeValue(state, 'company_title', value => user.company || value)
    changeValue(
      state,
      'phone_number',
      value => user.phone_number || user.work_phone || value
    )
    changeValue(state, 'mls_id', value => user.mlsid || value)
    changeValue(state, 'agent', () => (user.mlsid ? user.id : null))

    // set plural autosuggestion values
    changeValue(state, 'emails', () => user.emails || [])
    changeValue(state, 'phone_numbers', () => user.phone_numbers || [])
    changeValue(state, 'companies', () => user.companies || [])
  }

  handleClose = () => {
    this.formObject = {}
    this.props.onClose()
  }

  render() {
    if (!this.props.isOpen) {
      return false
    }

    return (
      <Fragment>
        <Container position={this.props.formOptions.position}>
          <Form
            validate={this.validate}
            onSubmit={this.onSubmit}
            initialValues={this.getInitialValues()}
            mutators={{
              populateRole: this.populateRole
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
                  isRoleRemovable={this.props.isRoleRemovable}
                  deal={this.props.deal}
                  formObject={this.formObject}
                  requiredFields={requiredFields}
                  visibleFields={visibleFields}
                  isAllowedRole={this.isAllowedRole}
                  onDeleteRole={this.handleClose}
                  onSubmit={this.handleSubmit}
                  onClose={this.handleClose}
                />
              )
            }}
          />
        </Container>
        {this.props.showOverlay && <Overlay />}
      </Fragment>
    )
  }
}

Role.propTypes = propTypes
Role.defaultProps = defaultProps

export default Role
