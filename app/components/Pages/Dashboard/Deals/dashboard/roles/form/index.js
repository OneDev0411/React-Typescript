import React, { Fragment } from 'react'
import { Form } from 'react-final-form'
import _ from 'underscore'
import { FormContainer } from './form-container'
import { Modal } from 'react-bootstrap'
import { ROLE_NAMES } from '../../../utils/roles'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import CancelButton from '../../../../../../../views/components/Button/CancelButton'

export class RoleFormModal extends React.Component {
  getInitialValues = () => {
    const { form, isSubmitting } = this.props

    if (isSubmitting) {
      return this.formObject
    }

    this.formObject = {
      ...form,
      ...this.preselectRole,
      ...this.commissionAttributes
    }

    return this.formObject
  }

  /**
   * preselect role, if there is only one allowed role to select
   */
  get preselectRole() {
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
  get commissionAttributes() {
    const { form } = this.props

    if (form && form.commission_percentage) {
      return {
        commission: form.commission_percentage,
        commission_type: 'commission_percentage'
      }
    }

    if (form && form.commission_dollar) {
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

  onSubmit = values => {
    // keeps the last object of submitted form
    this.formObject = values

    // send form to the parent
    this.props.onFormSubmit(this.normalizeForm(values))
  }

  validate = async values => {
    const errors = {}
    const requiredFields = this.getRequiredFields(values)
    const validators = this.getFormValidators(requiredFields)

    requiredFields.forEach(fieldName => {
      if (!values[fieldName]) {
        errors[fieldName] = 'Required'
      }
    })

    await Promise.all(
      _.map(values, async (fieldValue, fieldName) => {
        const validator = validators[fieldName]

        if (!validator) {
          return false
        }

        if (!errors[fieldName] && !await validator(fieldValue)) {
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
    const ingoreFields = ['commission', 'commission_type', 'user']

    if (commission_type === 'commission_dollar') {
      newValues.commission_dollar = parseFloat(commission)
    } else if (commission_type === 'commission_percentage') {
      newValues.commission_percentage = parseFloat(commission)
    }

    return _.omit(
      {
        ...values,
        ...newValues
      },
      (fieldValue, fieldName) => ingoreFields.includes(fieldName)
    )
  }

  /**
   * get required fields based on different scenarios
   * @param {Object} values - couples of form {Field:Value}
   */
  getRequiredFields = values => {
    const list = ['role']

    const { company_title, role } = values

    if (
      company_title &&
      this.isValidString(company_title, [], 'company_title')
    ) {
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
      list.push('legal_first_name', 'legal_last_name', 'company_title')
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

    if (/[0-9]{1,10}(\.[0-9]{1,2})?/.test(commission)) {
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

  render() {
    const { form, isOpen, modalTitle, onHide, isSubmitting } = this.props

    return (
      <Modal
        dialogClassName="deals__role-form--modal"
        show={isOpen}
        onHide={onHide}
        backdrop="static"
      >
        <Modal.Header closeButton>{modalTitle}</Modal.Header>
        <Form
          onSubmit={this.onSubmit}
          validate={this.validate}
          initialValues={this.getInitialValues()}
          render={({ handleSubmit, values, pristine, invalid }) => (
            <Fragment>
              <Modal.Body
                className="u-scrollbar--thinner"
                style={{ padding: 0 }}
              >
                <FormContainer
                  form={form}
                  values={values}
                  handleSubmit={handleSubmit}
                  shouldShowCommission={this.shouldShowCommission}
                  isAllowedRole={this.isAllowedRole}
                  requiredFields={this.getRequiredFields(values)}
                />
              </Modal.Body>
              <Modal.Footer>
                <CancelButton disabled={isSubmitting} onClick={onHide}>
                  Canecl
                </CancelButton>
                <ActionButton
                  onClick={() => handleSubmit(this.onSubmit)}
                  type="submit"
                  disabled={isSubmitting || pristine || invalid}
                >
                  {this.submitCaption}
                </ActionButton>
              </Modal.Footer>
            </Fragment>
          )}
        />
      </Modal>
    )
  }
}

export default RoleFormModal
