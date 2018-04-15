import React from 'react'
import _ from 'underscore'
import Name from './name'
import Role from './role'
import Title from './title'
import Commission from './commission'
import InputWithSelect from './input-with-select'
import { Button, Modal } from 'react-bootstrap'

const ROLE_NAMES = [
  'BuyerAgent',
  'BuyerReferral',
  'CoBuyerAgent',
  'SellerAgent',
  'SellerReferral',
  'CoSellerAgent',
  'Buyer',
  'BuyerPowerOfAttorney',
  'Seller',
  'SellerPowerOfAttorney',
  'Title',
  'BuyerLawyer',
  'SellerLawyer',
  'Lender',
  'TeamLead',
  'Appraiser',
  'Inspector',
  'Tenant',
  'LandlordPowerOfAttorney',
  'Landlord',
  'TenantPowerOfAttorney'
]

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    const form = props.form || {}

    const isNewRecord = typeof form.role === 'undefined'

    this.state = {
      form,
      isNewRecord,
      invalidFields: [],
      isFormCompleted: false,
      nameErrorMessage: undefined,
      nameErrorFields: []
    }
  }

  componentDidMount() {
    const { form, isNewRecord } = this.state

    if (isNewRecord) {
      _.keys(form, field => {
        this.validate(field, form[field])
      })
    }

    this.preselectRoles()
  }

  componentWillReceiveProps(nextProps) {
    const { form, showFormModal } = nextProps

    if (form && showFormModal && _.size(form) > 0) {
      const isNewRecord = typeof form.role === 'undefined'

      if (!isNewRecord) {
        _.keys(form, field => {
          this.validate(field, form[field])
        })
      } else {
        this.setState({
          nameErrorFields: [],
          nameErrorMessage: ''
        })
      }

      this.setState(
        {
          form,
          isNewRecord
        },
        () => this.preselectRoles()
      )
    }

    if (!form || !showFormModal) {
      this.setState(
        {
          form: {},
          invalidFields: []
        },
        () => this.preselectRoles()
      )
    }
  }

  /**
   * check role type is allowed to select or not
   */
  isAllowedRole = name => {
    const { deal, allowedRoles } = this.props
    const { form, isNewRecord } = this.state

    const dealType = deal ? deal.deal_type : null

    if (
      ((name === 'BuyerAgent' || form.role === 'BuyerAgent') &&
        dealType === 'Buying') ||
      ((name === 'SellerAgent' || form.role === 'SellerAgent') &&
        dealType === 'Selling')
    ) {
      return false
    }

    if (!allowedRoles || (!isNewRecord && form.role === name)) {
      return true
    }

    return allowedRoles.includes(name)
  }

  /**
   * preselect role, if there is any
   */
  preselectRoles = () => {
    const { form } = this.state
    const availableRoles = ROLE_NAMES.filter(name => this.isAllowedRole(name))
    const preselectedRole = availableRoles.length === 1 && availableRoles[0]

    if (!form.role && preselectedRole) {
      this.setForm('role', preselectedRole, null, false)
    }
  }

  /**
   * set form field's value
   */
  setForm(field, value, removeField = null, triggerFormChange = true) {
    const { form } = this.state
    const newForm = removeField ? _.omit(form, removeField) : form

    this.setState(
      {
        form: {
          ...newForm,
          [field]: value
        }
      },
      () => this.validate(field, value, triggerFormChange)
    )
  }

  setCommission(field, value) {
    const removeField =
      field === 'commission_percentage'
        ? 'commission_dollar'
        : 'commission_percentage'

    this.setForm(field, value, removeField)
  }

  /**
   * validate email
   */
  isEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return re.test(email)
  }

  /**
   * validate phone number
   */
  async isValidPhoneNumber(phoneNumber) {
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
  validateCommission(value) {
    const { form } = this.state

    if (!/^[0-9.]*$/.test(value)) {
      return false
    }

    return form.commission_percentage ? value >= 0 && value <= 100 : value >= 0
  }

  isValidName(name) {
    return name && name.trim().length > 0
  }

  /**
   * check email is required or not
   * https://gitlab.com/rechat/web/issues/563
   */
  isEmailRequired() {
    const { form } = this.state

    return ['BuyerAgent', 'SellerAgent'].indexOf(form.role) > -1
  }

  /**
   * check whether commission is required or not
   * it's required by default
   * https://gitlab.com/rechat/web/issues/691
   */
  isCommissionRequired(form) {
    const { deal, isCommissionRequired } = this.props

    // https://gitlab.com/rechat/web/issues/760
    if (deal && deal.deal_type === 'Buying' && form.role === 'SellerAgent') {
      return false
    }

    return (
      Commission.shouldShowCommission(form) && isCommissionRequired !== false
    )
  }

  /**
   * validate form
   */
  async validate(field, value, triggerFormChange = true) {
    const { form, invalidFields } = this.state
    const requiredFields = ['role']

    if (this.isEmailRequired()) {
      requiredFields.push('email')
    }

    const fields = {
      role: role => role,
      legal_prefix(value) {
        return ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'].includes(value)
      },
      legal_last_name: name => this.isValidName(name),
      legal_middle_name: name => this.isValidName(name),
      legal_first_name: name => this.isValidName(name),
      email: email => email && this.isEmail(email),
      phone_number: phoneNumber =>
        phoneNumber && this.isValidPhoneNumber(phoneNumber),
      commission_percentage: value => value && this.validateCommission(value),
      commission_dollar: value => value && this.validateCommission(value),
      company_title: name => name
    }

    if (this.isCommissionRequired(form)) {
      let commission_field = 'commission_percentage'

      if (form.commission_dollar > 0) {
        commission_field = 'commission_dollar'
      }

      requiredFields.push(commission_field)
    }

    // validate field
    const validator = fields[field]

    let newInvalidFields = invalidFields

    const removeField = () => {
      newInvalidFields = invalidFields.filter(f => field !== f)
      this.setState({
        invalidFields: newInvalidFields
      })
    }

    if (value) {
      if (
        ['legal_first_name', 'legal_last_name', 'company_title'].includes(field)
      ) {
        this.setState({
          nameErrorFields: [],
          nameErrorMessage: ''
        })
      }

      if (typeof validator === 'function' && (await validator(value))) {
        // validated! so remove field from invalidFields
        if (invalidFields.length > 0 && invalidFields.includes(field)) {
          removeField()
        }
      } else if (
        typeof validator === 'function' &&
        !invalidFields.includes(field)
      ) {
        // add field to invalidfields
        newInvalidFields = [...invalidFields, field]
        this.setState({
          invalidFields: newInvalidFields
        })
      }
    } else if (invalidFields.includes(field)) {
      removeField()
    }

    const isFormCompleted =
      _.every(requiredFields, name => fields[name](form[name])) &&
      newInvalidFields.length === 0

    this.setState({ isFormCompleted })

    if (triggerFormChange) {
      this.props.onFormChange(form)
    }
  }

  extractItems({ form = {}, singularName, pluralName }) {
    if (_.size(form) === 0) {
      return []
    }

    const pluralValues = form[pluralName]

    if (pluralValues && _.isArray(pluralValues) && pluralValues.length > 0) {
      const values = []

      singularName.forEach(name => {
        pluralValues.forEach(item => values.push(item[name]))
      })

      return values.filter(i => i)
    }

    const singleValues = []

    singularName.forEach(name => {
      if (form[name]) {
        singleValues.push(form[name])
      }
    })

    return singleValues.filter(i => i)
  }

  submit = () => {
    const { onSubmit } = this.props
    const { form } = this.state
    let nameErrorMessage
    let nameErrorFields = []

    if (
      !form.legal_first_name &&
      !form.legal_last_name &&
      (!form.company_title || !form.company_title.trim())
    ) {
      nameErrorMessage = 'Please add a name or a company to continue'
      nameErrorFields = ['legal_first_name', 'legal_last_name', 'company_title']
    } else if (form.legal_first_name && !form.legal_last_name) {
      nameErrorMessage = 'Legal last name is required'
      nameErrorFields = ['legal_last_name']
    } else if (!form.legal_first_name && form.legal_last_name) {
      nameErrorMessage = 'Legal first name is required'
      nameErrorFields = ['legal_first_name']
    } else {
      onSubmit()
    }

    this.setState({ nameErrorMessage, nameErrorFields })
  }

  render() {
    const {
      form,
      invalidFields,
      isFormCompleted,
      nameErrorMessage,
      nameErrorFields
    } = this.state
    const {
      deal,
      showFormModal,
      handlOnHide,
      modalTitle,
      isSaving,
      submitButtonText,
      formNotChanged
    } = this.props

    return (
      <Modal
        show={showFormModal}
        onHide={handlOnHide}
        dialogClassName="modal-deal-add-role"
        backdrop="static"
      >
        <Modal.Header closeButton>{modalTitle}</Modal.Header>

        <Modal.Body>
          <div className="deal-roles-form">
            <div className="row-name">
              <Title
                isInvalid={invalidFields.includes('legal_prefix')}
                form={form}
                onChange={value => this.setForm('legal_prefix', value)}
              />

              <Name
                id="first_name"
                name="first_name"
                lableColorError={nameErrorFields.includes('legal_first_name')}
                isRequired={false}
                title="Legal First Name"
                value={form.legal_first_name}
                isInvalid={invalidFields.includes('legal_first_name')}
                onChange={value => this.setForm('legal_first_name', value)}
              />

              <Name
                id="middle_name"
                name="middle_name"
                isRequired={false}
                title="Legal Middle Name"
                value={form.legal_middle_name}
                isInvalid={invalidFields.includes('legal_middle_name')}
                onChange={value => this.setForm('legal_middle_name', value)}
              />

              <Name
                id="last_name"
                name="last_name"
                lableColorError={nameErrorFields.includes('legal_last_name')}
                isRequired={false}
                title="Legal Last Name"
                value={form.legal_last_name}
                isInvalid={invalidFields.includes('legal_last_name')}
                onChange={value => this.setForm('legal_last_name', value)}
              />
            </div>

            <InputWithSelect
              lableColorError={nameErrorFields.includes('company_title')}
              title="Company"
              inputType="Text"
              defaultSelectedItem={form.companies}
              onChangeHandler={value => this.setForm('company_title', value)}
              items={this.extractItems({
                form,
                singularName: ['company', 'company_title'],
                pluralName: 'companies'
              })}
            />

            <InputWithSelect
              title="Email"
              inputType="Email"
              errorText="Enter a valid email"
              defaultSelectedItem={form.email}
              isRequired={this.isEmailRequired()}
              isInvalid={invalidFields.includes('email')}
              onChangeHandler={value => this.setForm('email', value)}
              items={this.extractItems({
                form,
                singularName: ['email'],
                pluralName: 'emails'
              })}
            />

            <InputWithSelect
              title="Phone"
              inputType="Phone"
              errorText="The value is not a valid U.S phone number"
              defaultSelectedItem={form.phone_number}
              isInvalid={invalidFields.includes('phone_number')}
              onChangeHandler={value => this.setForm('phone_number', value)}
              items={this.extractItems({
                form,
                singularName: ['phone_number'],
                pluralName: 'phones'
              })}
            />

            <Role
              deal={deal}
              form={form}
              role_names={ROLE_NAMES}
              onChange={value => this.setForm('role', value)}
              isAllowed={this.isAllowedRole.bind(this)}
            />

            <Commission
              form={form}
              isRequired={this.isCommissionRequired(form)}
              validateCommission={this.validateCommission.bind(this)}
              onChange={(field, value) => this.setCommission(field, value)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <p className="modal-footer-error">{nameErrorMessage}</p>
          <Button
            onClick={this.submit}
            disabled={!isFormCompleted || isSaving || formNotChanged}
            bsStyle={!isFormCompleted ? 'link' : 'primary'}
            className={`btn-deal ${!isFormCompleted ? 'disabled' : ''}`}
          >
            {submitButtonText}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
