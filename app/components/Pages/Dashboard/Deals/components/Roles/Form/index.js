import React from 'react'
import _ from 'underscore'
import { RoleFormContainer } from './FormContainer'
import { ROLE_NAMES } from '../../../utils/roles'
import { FinalFormDrawer } from 'components/FinalFormDrawer'

import { TYPE_PERSON, TYPE_COMPANY } from './FormComponents/TypeInput'

export class RoleFormModal extends React.Component {
  getInitialValues = () => {
    if (!this.props.isOpen) {
      return {}
    }

    if (this.props.isSubmitting) {
      return this.formObject
    }

    this.formObject = {
      ...this.props.form,
      ...this.FormType,
      ...this.PreselectRole,
      ...this.CommissionAttributes
    }

    return this.formObject
  }

  get FormType() {
    const { form } = this.props

    return {
      user_type:
        !form || form.legal_first_name || form.legal_last_name
          ? TYPE_PERSON
          : TYPE_COMPANY
    }
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

  /**
   * returns commission attributes
   */
  get CommissionAttributes() {
    const { form } = this.props

    if (form && form.commission_percentage !== null) {
      return {
        commission: form.commission_percentage,
        commission_type: 'commission_percentage'
      }
    }

    if (form && form.commission_dollar !== null) {
      return {
        commission: form.commission_dollar,
        commission_type: 'commission_dollar'
      }
    }

    return {
      commission: '',
      commission_type: 'commission_percentage'
    }
  }

  onSubmit = async values => {
    // keeps the last object of submitted form
    this.formObject = values

    // send form to the parent
    await this.props.onFormSubmit(this.normalizeForm(values))
  }

  validate = async values => {
    const errors = {}
    const requiredFields = this.getRequiredFields(values)
    const validators = this.getFormValidators(requiredFields)

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
          errors[fieldName] = this.errorNames[fieldName]
        }
      })
    )

    return errors
  }

  /**
   * get normalized form
   * commission logic: commission_type + commission = commission_<type>
   */
  normalizeForm = values => {
    const newValues = {}
    const { commission, commission_type } = values

    const validFields = [
      'id',
      'contact',
      'legal_prefix',
      'legal_first_name',
      'legal_middle_name',
      'legal_last_name',
      'company_title',
      'email',
      'phone_number',
      'role',
      'commission',
      'commission_dollar',
      'commission_percentage',
      'source_type'
    ]

    if (commission_type === 'commission_dollar') {
      newValues.commission_dollar = parseFloat(commission)
      newValues.commission_percentage = null
    } else if (commission_type === 'commission_percentage') {
      newValues.commission_percentage = parseFloat(commission)
      newValues.commission_dollar = null
    }

    if (!values.contact) {
      newValues.source_type = 'ExplicitlyCreated'
    }

    return _.pick(
      {
        ...values,
        ...newValues
      },
      validFields
    )
  }

  /**
   * get required fields based on different scenarios
   * @param {Object} values - couples of form {Field:Value}
   */
  getRequiredFields = values => {
    const list = ['role']

    const { role, user_type } = values

    if (user_type === TYPE_COMPANY) {
      list.push('company_title')
    } else {
      list.push('legal_first_name', 'legal_last_name')
    }

    if (this.isEmailRequired(role)) {
      list.push('email')
    }

    if (this.isCommissionRequired(role)) {
      list.push('commission')
    }

    // when adding an agent, company should be mandatory
    if (role && role.includes('Agent')) {
      list.push('legal_first_name', 'legal_last_name')
    }

    if (this.isCompanyRequired(role)) {
      list.push('company_title')
    }

    /**
     * Required fields for EscrowOfficer according to web#1192
     * https://gitlab.com/rechat/web/issues/1192
     */
    if (role === 'Title') {
      list.push(
        'legal_first_name',
        'legal_last_name',
        'company_title',
        'email',
        'phone_number'
      )
    }

    return _.uniq(list)
  }

  /**
   * get form validators
   */
  getFormValidators = requiredFields => ({
    role: role => role,
    legal_prefix: value => this.isValidLegalPrefix(value, requiredFields),
    legal_last_name: name =>
      this.isValidString(name, requiredFields, 'legal_last_name'),
    legal_middle_name: name =>
      this.isValidString(name, requiredFields, 'legal_middle_name'),
    legal_first_name: name =>
      this.isValidString(name, requiredFields, 'legal_first_name'),
    company_title: name =>
      this.isValidString(name, requiredFields, 'company_title'),
    email: email => this.isValidEmail(email, requiredFields),
    phone_number: phoneNumber =>
      this.isValidPhoneNumber(phoneNumber, requiredFields),
    commission: value => this.isValidCommission(value, requiredFields)
  })

  /**
   * get error names
   */
  get errorNames() {
    return {
      legal_first_name: 'Invalid Legal First Name',
      legal_last_name: 'Invalid Legal Last Name',
      company_title: 'Invalid Company',
      email: 'Invalid Email Address',
      phone_number: 'Phone Number is invalid (###)###-####',
      commission: 'Invalid Commission value'
    }
  }

  /**
   * check role type is allowed to select or not
   */
  isAllowedRole = (name, formRole) => {
    const { deal, form, allowedRoles } = this.props

    const dealType = deal ? deal.deal_type : null

    if (
      ((name === 'BuyerAgent' || formRole === 'BuyerAgent') &&
        dealType === 'Buying') ||
      ((name === 'SellerAgent' || formRole === 'SellerAgent') &&
        dealType === 'Selling')
    ) {
      return false
    }

    if (!allowedRoles || (!this.isNewRecord && form.role === name)) {
      return true
    }

    return allowedRoles.includes(name)
  }

  /**
   * validate email
   */
  isValidEmail = (email, requiredFields) => {
    if (!email && !requiredFields.includes('email')) {
      return true
    }

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return re.test(email)
  }

  /**
   * validate legal prefix
   */
  isValidLegalPrefix = (prefix, requiredFields) => {
    if (!prefix && !requiredFields.includes('legal_prefix')) {
      return true
    }

    return ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'].includes(prefix)
  }

  /**
   * validate phone number
   */
  isValidPhoneNumber = async (phoneNumber, requiredFields) => {
    if (!phoneNumber && !requiredFields.includes('phone_number')) {
      return true
    }

    const {
      PhoneNumberUtil
    } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)
    const phoneUtil = PhoneNumberUtil.getInstance()

    try {
      return phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber, 'US'))
    } catch (e) {
      return false
    }
  }

  /**
   * validate commission value
   */
  isValidCommission = (commission, requiredFields) => {
    if (!commission && !requiredFields.includes('commission')) {
      return true
    }

    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(parseFloat(commission)) && isFinite(commission)) {
      return true
    }

    return false
  }

  /**
   * validate string value
   */
  isValidString = (str, requiredFields, fieldName) => {
    if (!str && !requiredFields.includes(fieldName)) {
      return true
    }

    return str && str.trim().length > 0
  }

  /**
   * check email is required or not
   * https://gitlab.com/rechat/web/issues/563
   */
  isEmailRequired = role => ['BuyerAgent', 'SellerAgent'].includes(role)

  /**
   * check company is required or not
   * see https://gitlab.com/rechat/web/issues/1217
   */
  isCompanyRequired = role => {
    let otherSideAgents = []
    const { deal, dealSide } = this.props
    const side = deal ? deal.deal_type : dealSide

    if (!side) {
      return false
    }

    if (side === 'Selling') {
      otherSideAgents = ['BuyerAgent', 'CoBuyerAgent']
    }

    if (side === 'Buying') {
      otherSideAgents = ['SellerAgent', 'CoSellerAgent']
    }

    return otherSideAgents.includes(role)
  }

  /**
   * check whether commission is required or not
   * it's required by default
   * https://gitlab.com/rechat/web/issues/691
   */
  isCommissionRequired = role => {
    const { deal, isCommissionRequired } = this.props

    // https://gitlab.com/rechat/web/issues/760
    if (deal && deal.deal_type === 'Buying' && role === 'SellerAgent') {
      return false
    }

    return this.shouldShowCommission(role) && isCommissionRequired !== false
  }

  /**
   * check whether should show commission or not
   */
  shouldShowCommission = role =>
    [
      'CoBuyerAgent',
      'BuyerAgent',
      'BuyerReferral',
      'CoSellerAgent',
      'SellerAgent',
      'SellerReferral'
    ].includes(role)

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

  onClose = () => {
    this.formObject = {}
    this.props.onHide()
  }

  render() {
    return (
      <FinalFormDrawer
        onSubmit={this.onSubmit}
        validate={this.validate}
        initialValues={this.getInitialValues()}
        isOpen={this.props.isOpen}
        onClose={this.onClose}
        title={this.props.modalTitle}
        submitting={this.props.isSubmitting}
        submitButtonLabel={this.submitCaption}
        submittingButtonLabel={this.submitCaption}
        showReset={false}
        reinitializeAfterSubmit={false}
        render={({ values, handleSubmit }) => (
          <RoleFormContainer
            form={this.props.form}
            values={values}
            handleSubmit={handleSubmit}
            shouldShowCommission={this.shouldShowCommission}
            isAllowedRole={this.isAllowedRole}
            requiredFields={this.getRequiredFields(values)}
          />
        )}
      />
    )
  }
}

export default RoleFormModal
