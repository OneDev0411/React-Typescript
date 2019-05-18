import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { Form } from 'react-final-form'

import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'

import BareModal from 'components/BareModal'
import { Portal } from 'components/Portal'

import { createContacts } from 'models/contacts/create-contacts'
import { createRoles, updateRole } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import {
  ROLE_NAMES,
  convertRoleToContact,
  getLegalFullName,
  getContactDiff
} from 'deals/utils/roles'

import { FormContainer } from './Form'

import { TYPE_PERSON } from './constants/role-types'

import { normalizeForm } from './helpers/normalize-form'
import getRequiredFields from './helpers/get-required-fields'
import getVisibleFields from './helpers/get-visible-fields'
import { getFormValidators } from './validators'
import { getCommissionAttributes } from './helpers/get-commission-attributes'

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  deal: PropTypes.object.isRequired,
  form: PropTypes.object,
  allowedRoles: PropTypes.array,
  container: PropTypes.oneOf(['Modal', 'Inline']),
  isRoleRemovable: PropTypes.bool,
  isCommissionRequired: PropTypes.bool,
  onUpsertRole: PropTypes.func
}

const defaultProps = {
  form: null,
  container: 'Modal',
  isRoleRemovable: false,
  isCommissionRequired: false,
  allowedRoles: [],
  onUpsertRole: () => null
}

class Role extends React.Component {
  state = {
    isSaving: false
  }

  getInitialValues = () => {
    if (!this.props.isOpen) {
      return {}
    }

    if (this.state.isSaving) {
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
      !this.props.allowedRoles.length ||
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
    try {
      const form = normalizeForm(values)

      this.setState({
        isSaving: true
      })

      if (this.isNewRecord) {
        if (form.contact) {
          const upsertedAttributes = getContactDiff(
            form,
            this.props.attributeDefs
          )

          if (upsertedAttributes.length > 0) {
            await upsertContactAttributes(form.contact.id, upsertedAttributes)

            this.props.notify({
              message: `${getLegalFullName(form)} Updated.`,
              status: 'success'
            })
          }
        } else {
          this.createNewContact(form)
        }

        if (this.props.deal) {
          const newRoles = await this.props.createRoles(this.props.deal.id, [
            form
          ])

          this.props.onUpsertRole(newRoles[0])
        } else {
          this.props.onUpsertRole({
            id: new Date().getTime(),
            ...form
          })
        }
      }

      if (!this.isNewRecord) {
        const updatedRole = this.props.deal
          ? await this.props.updateRole(this.props.deal.id, form)
          : form

        this.props.onUpsertRole(updatedRole)
      }
    } catch (e) {
      this.props.notify({
        message: 'Could not save the contact. please try again.',
        status: 'error'
      })

      console.log(e)
    } finally {
      this.setState({
        isSaving: false
      })

      this.handleClose()
    }
  }

  createNewContact = async form => {
    if (
      !this.formObject.saveRoleInContacts ||
      this.props.user.email === form.email
    ) {
      return false
    }

    try {
      await createContacts([
        convertRoleToContact(form, this.props.user.id, this.props.attributeDefs)
      ])

      this.props.notify({
        message: `New Contact Created: ${getLegalFullName(form)}`,
        status: 'success'
      })
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
      <BareModal isOpen style={{ content: { height: 'auto' } }}>
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
                isSubmitting={this.state.isSaving}
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
      </BareModal>
    )
  }
}

Role.propTypes = propTypes
Role.defaultProps = defaultProps

function mapStateToProps({ user, contacts }) {
  return {
    user,
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(
  mapStateToProps,
  {
    notify,
    updateRole,
    createRoles,
    confirmation
  }
)(Role)
