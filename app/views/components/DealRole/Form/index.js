import React from 'react'

import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import { connect } from 'react-redux'

import { Context as DealRoleContext } from '@app/contexts/deals-roles-definitions/context'
import { confirmation } from 'actions/confirmation'
import { createRoles, updateRole } from 'actions/deals'
import { addNotification as notify } from 'components/notification'
import {
  convertRoleToContact,
  getLegalFullName,
  getContactChangedAttributes
} from 'deals/utils/roles'
import { createContacts } from 'models/contacts/create-contacts'
import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'

import { LEGAL_PREFIXES } from '../constants/legal_prefixes'
import { TYPE_PERSON } from '../constants/role-types'
import { getCommissionAttributes } from '../helpers/get-commission-attributes'
import getRequiredFields from '../helpers/get-required-fields'
import getVisibleFields from '../helpers/get-visible-fields'
import { normalizeForm } from '../helpers/normalize-form'
import { getFormValidators } from '../validators'

import { OfficeForm } from './Office'
import { RoleForm } from './Role'

const propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deal: PropTypes.object,
  checklist: PropTypes.object,
  form: PropTypes.object,
  defaultRole: PropTypes.string,
  allowedRoles: PropTypes.array,
  isRoleRemovable: PropTypes.bool,
  isCommissionRequired: PropTypes.bool,
  showBrokerageFields: PropTypes.bool,
  compact: PropTypes.bool,
  onBeforeUpsert: PropTypes.func,
  onUpsertRole: PropTypes.func,
  onDeleteRole: PropTypes.func,
  showSaveContactButton: PropTypes.bool,
  dealSide: PropTypes.string
}

const defaultProps = {
  form: null,
  checklist: null,
  isRoleRemovable: false,
  isCommissionRequired: true,
  showBrokerageFields: false,
  compact: false,
  title: '',
  defaultRole: '',
  allowedRoles: [],
  onUpsertRole: () => null,
  onDeleteRole: () => null
}

export class DealRole extends React.Component {
  state = {
    isSaving: false
  }

  static contextType = DealRoleContext

  getInitialValues = () => {
    if (!this.props.isOpen) {
      return {}
    }

    if (this.state.isSaving) {
      return this.formObject
    }

    const { form, checklist } = this.props

    this.formObject = {
      saveRoleInContacts: true,
      ...form,
      ...this.PreselectRole,
      ...getCommissionAttributes(form),
      role_type: this.getRoleType(),
      checklist: checklist ? checklist.id : undefined,
      mls_id: this.getMlsId(),
      agents: form?.user?.agents ?? form?.agents
    }

    return this.formObject
  }

  getRoleType = () => {
    const { form } = this.props

    if (form && form.role_type) {
      return form.role_type
    }

    return TYPE_PERSON
  }

  getMlsId = () => {
    const { form } = this.props

    if (form?.agent) {
      return form.agent.mlsid
    }

    if ((form?.agents || []).length === 1) {
      return form?.agents[0].mlsid
    }

    return ''
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
    const { form, defaultRole } = this.props
    const formRole = form && form.role

    if (formRole) {
      return {
        role: formRole
      }
    }

    const list = this.context.list.map(definition => definition.role)
    const availableRoles = list.filter(name => this.isAllowedRole(name))

    const preselectedRole = availableRoles.some(name => name === defaultRole)
      ? defaultRole
      : availableRoles.length > 0 && availableRoles[0]

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

      if (typeof this.props.onBeforeUpsert === 'function') {
        await this.props.onBeforeUpsert()
      }

      if (this.isNewRecord) {
        await Promise.all([
          await this.upsertContact(form),
          await this.createRole(form)
        ])
      } else {
        await Promise.all([
          await this.upsertContact(form),
          await this.updateRole(form)
        ])
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

  upsertContact = async form => {
    if (
      !this.formObject.saveRoleInContacts ||
      this.props.user.email === form.email
    ) {
      return
    }

    if (form.contact) {
      const upsertedAttributes = getContactChangedAttributes(
        form,
        this.props.attributeDefs
      )

      await upsertContactAttributes(form.contact.id, upsertedAttributes)

      this.props.notify({
        message: `${getLegalFullName(form)} Updated.`,
        status: 'success'
      })

      return
    }

    await createContacts([
      convertRoleToContact(form, this.props.user.id, this.props.attributeDefs)
    ])

    this.props.notify({
      message: `New Contact Created: ${getLegalFullName(form)}`,
      status: 'success'
    })
  }

  createRole = async form => {
    if (this.props.deal) {
      const newRoles = await this.props.createRoles(this.props.deal.id, [form])

      this.props.onUpsertRole(newRoles[0], 'create')

      return
    }

    this.props.onUpsertRole(
      {
        id: new Date().getTime(),
        ...form
      },
      'create'
    )
  }

  updateRole = async form => {
    const updatedRole = this.props.deal
      ? await this.props.updateRole(this.props.deal.id, form)
      : form

    this.props.onUpsertRole(updatedRole, 'update')
  }

  validate = async values => {
    const errors = {}

    const { requiredFields } = this.getFormProperties(values)
    const validators = getFormValidators(this.context.list, requiredFields)

    requiredFields.forEach(fieldName => {
      let value = values[fieldName]

      if (value === undefined || value === null || value.length === 0) {
        errors[fieldName] = `${
          this.aliases[fieldName] || fieldName
        } is Required`
      }
    })

    await Promise.all(
      Object.entries(values).map(async ([fieldName, fieldValue]) => {
        const validator = validators[fieldName]

        if (!validator) {
          return false
        }

        let isValid = false

        try {
          isValid = await validator(fieldValue)
        } catch (e) {
          /* nothing */
        }

        if (!errors[fieldName] && !isValid) {
          errors[fieldName] = this.errorNames[fieldName] || 'Invalid input'
        }
      })
    )

    return errors
  }

  /**
   * get error names
   */
  get errorNames() {
    const INVALID_EMAIL = 'Invalid Email Address'
    const INVALID_PHONE = 'Number is invalid'
    const INVALID_ADDRESS = 'Invalid address'
    const INVALID_MLS = 'Invalid MLS ID'

    return {
      legal_first_name: 'Invalid Legal First Name',
      legal_last_name: 'Invalid Legal Last Name',
      mls_id: INVALID_MLS,
      office_mls_id: INVALID_MLS,
      office_license_number: 'Invalid license number',
      company_title: 'Invalid Company',
      email: INVALID_EMAIL,
      office_email: INVALID_EMAIL,
      phone_number: `Phone ${INVALID_PHONE}`,
      office_phone: `Phone ${INVALID_PHONE}`,
      office_fax: `Fax ${INVALID_PHONE}`,
      commission: 'Invalid Commission value',
      current_address: INVALID_ADDRESS,
      office_address: INVALID_ADDRESS
    }
  }

  get aliases() {
    return {
      legal_first_name: 'First Name',
      legal_last_name: 'Last Name',
      email: 'Email',
      mls_id: 'MLS Number',
      company_title: 'Company Name',
      phone_number: 'Phone Number',
      commission: 'Commission',
      current_address: 'Address'
    }
  }

  /**
   * get form is new record or not
   */
  get isNewRecord() {
    return !this.props?.form?.id
  }

  getFormProperties = values => {
    const { props } = this

    const shared = {
      role: values.role,
      role_type: values.role_type,
      agents: values.agents
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
      isBrokerageForm: props.showBrokerageFields,
      visibleFields,
      ...shared
    })

    return { visibleFields, requiredFields }
  }

  populateRole = ([user, component], state, { changeValue }) => {
    if (component === 'MlsSelect') {
      changeValue(state, 'mls_id', () => user.mlsid || '')
      changeValue(state, 'company_title', () => user?.office?.name || '')

      return
    }

    if (user.contact) {
      changeValue(state, 'contact', () => user.contact)
    }

    changeValue(state, 'legal_first_name', () => user.first_name || '')
    changeValue(state, 'legal_last_name', () => user.last_name || '')
    changeValue(state, 'legal_middle_name', () => user.middle_name || '')
    changeValue(state, 'email', () => user.email || '')
    changeValue(state, 'mls_id', () => user.mlsid || '')
    changeValue(state, 'agent', () => (user.mlsid ? user.id : null))
    changeValue(state, 'current_address', () => user.current_address || {})
    changeValue(state, 'legal_prefix', () =>
      user.title && LEGAL_PREFIXES.includes(user.title) ? user.title : null
    )
    changeValue(
      state,
      'phone_number',
      () => user.phone_number || user.work_phone || ''
    )
    changeValue(
      state,
      'company_title',
      () => user.company || user?.office?.name || ''
    )

    // set plural autosuggestion values
    changeValue(state, 'emails', () => user.emails || [])
    changeValue(state, 'phone_numbers', () => user.phone_numbers || [])
    changeValue(state, 'companies', () => user.companies || [])
  }

  handleClose = () => {
    this.formObject = {}
    this.props.onClose()
  }

  handleDeleteRole = () => {
    this.props.onDeleteRole({
      ...this.formObject,
      deleted: true
    })

    this.handleClose()
  }

  render() {
    if (!this.props.isOpen) {
      return false
    }

    return (
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

          const sharedProps = {
            ...formProps,
            title: this.props.title,
            initialValues: this.formObject,
            deal: this.props.deal,
            compact: this.props.compact,
            isSubmitting: this.state.isSaving,
            onSubmit: this.handleSubmit,
            onClose: this.handleClose
          }

          return (
            <>
              {this.props.showBrokerageFields ? (
                <OfficeForm {...sharedProps} />
              ) : (
                <RoleForm
                  {...sharedProps}
                  isNewRecord={this.isNewRecord}
                  isRoleRemovable={this.props.isRoleRemovable}
                  requiredFields={requiredFields}
                  visibleFields={visibleFields}
                  isAllowedRole={this.isAllowedRole}
                  userEmail={this.props.user.email}
                  onDeleteRole={this.handleDeleteRole}
                />
              )}
            </>
          )
        }}
      />
    )
  }
}

DealRole.propTypes = propTypes
DealRole.defaultProps = defaultProps

function mapStateToProps({ user, contacts }) {
  return {
    user,
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(mapStateToProps, {
  notify,
  updateRole,
  createRoles,
  confirmation
})(DealRole)
