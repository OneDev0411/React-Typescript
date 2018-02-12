import React from 'react'
import _ from 'underscore'
import Name from './name'
import Role from './role'
import Title from './title'
import Commission from './commission'
import InputWithSelect from './input-with-select'

const ROLE_NAMES = [
  'BuyerAgent',
  'BuyerReferral',
  'CoBuyerAgent',
  'SellerAgent',
  'SellerReferral',
  'CoSellerAgent',
  'Buyer',
  'Seller',
  'Title',
  'Lawyer',
  'Lender',
  'TeamLead',
  'Appraiser',
  'Inspector',
  'Tenant',
  'Landlord'
]

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    const form = props.form || {}

    const isNewRecord = typeof form.role === 'undefined'

    // console.log('isNewRecord', isNewRecord, form)

    this.state = {
      form,
      isNewRecord,
      invalidFields: []
    }

    // this.validate = _.debounce(this.validate, 200)
  }

  componentDidMount() {
    const { form, isNewRecord } = this.state

    if (isNewRecord) {
      Object.keys(form).forEach(field => {
        this.validate(field, form[field])
      })

      return
    }

    this.preselectRoles()
  }

  /**
   * check role type is allowed to select or not
   */
  isAllowedRole = name => {
    const { deal, allowedRoles } = this.props
    const { form, isNewRecord } = this.state

    const dealType = deal ? deal.deal_type : null

    if (
      (name === 'BuyerAgent' && dealType === 'Buying') ||
      (name === 'SellerAgent' && dealType === 'Selling')
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
    const availableRoles = ROLE_NAMES.filter(name => this.isAllowedRole(name))
    const preselectedRole = availableRoles.length === 1 && availableRoles[0]

    if (preselectedRole) {
      this.setState({
        form: {
          ...this.state.form,
          role: preselectedRole
        }
      })
    }
  }

  /**
   * set form field's value
   */
  setForm(field, value) {
    const { form } = this.state

    this.setState(
      {
        form: {
          ...form,
          [field]: value
        }
      },
      () => this.validate(field, value)
    )
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

  isValidName(name, regular = /^[A-Za-z\s]+$/) {
    return name && name.trim().length > 0 && new RegExp(regular).exec(name)
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
    return (
      Commission.shouldShowCommission(form) &&
      this.props.isCommissionRequired !== false
    )
  }

  /**
   * validate form
   */
  async validate(field, value) {
    const { form, invalidFields } = this.state
    const requiredFields = ['legal_first_name', 'legal_last_name', 'role']

    if (this.isEmailRequired()) {
      requiredFields.push('email')
    }

    const fields = {
      role: role => role,
      legal_prefix: value =>
        ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'].indexOf(value) > -1,
      email: email => email && this.isEmail(email),
      legal_last_name: name => this.isValidName(name),
      legal_first_name: name => this.isValidName(name),
      legal_middle_name: name => this.isValidName(name),
      phone_number: phoneNumber =>
        phoneNumber && this.isValidPhoneNumber(phoneNumber),
      company_title: name => this.isValidName(name, /^['A-Za-z\s]+$/),
      commission_percentage: value => value && this.validateCommission(value),
      commission_dollar: value => value && this.validateCommission(value)
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
      if (typeof validator === 'function' && (await validator(value))) {
        // validated! so remove field from invalidFields
        if (invalidFields.length > 0 && invalidFields.includes(field)) {
          removeField()
        }
      } else if (!invalidFields.includes(field)) {
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
      !newInvalidFields.includes(field)

    this.props.onFormChange({
      isFormCompleted,
      form
    })
  }

  extractItems({ form = {}, singularName, pluralName }) {
    if (_.size(form) === 0) {
      return []
    }

    const pluralValues = form[pluralName]

    if (pluralValues && _.isArray(pluralValues)) {
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

  render() {
    const { form, invalidFields } = this.state
    const { deal } = this.props
    const { role } = form

    const shouldShowCompany =
      role && !['Buyer', 'Seller', 'Landlord', 'Tenant'].includes(role)

    return (
      <div className="deal-roles-form">
        <div className="row-name">
          <Title
            form={form}
            onChange={value => this.setForm('legal_prefix', value)}
          />

          <Name
            id="first_name"
            name="first_name"
            title="Legal First Name"
            placeholder="Legal First"
            value={form.legal_first_name}
            isInvalid={invalidFields.includes('legal_first_name')}
            onChange={value => this.setForm('legal_first_name', value)}
          />

          <Name
            id="middle_name"
            name="middle_name"
            isRequired={false}
            title="Legal Middle Name"
            placeholder="Legal Middle"
            value={form.legal_middle_name}
            isInvalid={invalidFields.includes('legal_middle_name')}
            onChange={value => this.setForm('legal_middle_name', value)}
          />

          <Name
            id="last_name"
            name="last_name"
            title="Legal Last Name"
            placeholder="Legal Last"
            value={form.legal_last_name}
            isInvalid={invalidFields.includes('legal_last_name')}
            onChange={value => this.setForm('legal_last_name', value)}
          />
        </div>

        <InputWithSelect
          title="Email"
          errorText="Enter a valid email"
          placeholder="example@gmail.com"
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
          errorText="Enter a valid phone"
          placeholder="(###) - ### ####"
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
          onChange={(field, value) => this.setForm(field, value)}
        />

        {shouldShowCompany && (
          <InputWithSelect
            title="Company"
            errorText="Please include only letters and numbers. You have added special character."
            placeholder="Company Name"
            defaultSelectedItem={form.companies}
            isInvalid={invalidFields.includes('company_title')}
            onChangeHandler={value => this.setForm('company_title', value)}
            items={this.extractItems({
              form,
              singularName: ['company', 'company_title'],
              pluralName: 'companies'
            })}
          />
        )}
      </div>
    )
  }
}
