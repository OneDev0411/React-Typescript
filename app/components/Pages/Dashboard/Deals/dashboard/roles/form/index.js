import React from 'react'
import _ from 'underscore'
import { Dropdown, MenuItem } from 'react-bootstrap'
import cn from 'classnames'
import Title from './title'
import Name from './name'
import Email from './email'
import Phone from './phone'
import Role from './role'
import Company from './company'
import Commission from './commission'

const role_names = [
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

    form.isNewRecord = typeof form.id === 'undefined'

    this.state = {
      invalidFields: [],
      form
    }

    this.validate = _.debounce(this.validate, 200)
  }

  componentDidMount() {
    this.preselectRoles()
  }

  /**
   * preselect role, if there is any
   */
  preselectRoles() {
    const { form } = this.state

    if (form.isNewRecord === false && form.role) {
      return false
    }

    const availableRoles = role_names.filter(name => this.isAllowedRole(name))
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
  async isValidPhone(phone) {
    const {
      PhoneNumberUtil
    } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)
    const phoneUtil = PhoneNumberUtil.getInstance()

    try {
      let phoneNumber = phoneUtil.parse(phone, 'US')

      return phoneUtil.isValidNumber(phoneNumber)
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
    return name && name.length > 0 && new RegExp(/^[A-Za-z\s]+$/).exec(name)
  }

  /**
   * check role type is allowed to select or not
   */
  isAllowedRole(name) {
    const { deal, allowedRoles } = this.props
    const { form } = this.state

    const dealType = deal ? deal.deal_type : null

    if (
      (name === 'BuyerAgent' && dealType === 'Buying') ||
      (name === 'SellerAgent' && dealType === 'Selling')
    ) {
      return false
    }

    if (!allowedRoles || (!form.isNewRecord && form.role === name)) {
      return true
    }

    return allowedRoles.indexOf(name) > -1
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
      legal_prefix: value => ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'].indexOf(value) > -1,
      email: email => email && this.isEmail(email),
      legal_last_name: name => this.isValidName(name),
      legal_first_name: name => this.isValidName(name),
      phone: phone => phone && this.isValidPhone(phone),
      company_title: name => this.isValidName(name)
    }

    let commission_field = 'commission_percentage'

    if (form.commission_dollar > 0) {
      commission_field = 'commission_dollar'
    }

    if (commission_field && Commission.shouldShowCommission(form)) {
      requiredFields.push(commission_field)
      fields[commission_field] = value => value && this.validateCommission(value)
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

    if (value.length > 0) {
      if (await validator(value)) {
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

  render() {
    const { form, invalidFields } = this.state
    const { deal } = this.props

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
            id="last_name"
            name="last_name"
            title="Legal Last Name"
            placeholder="Legal Last"
            value={form.legal_last_name}
            isInvalid={invalidFields.includes('legal_last_name')}
            onChange={value => this.setForm('legal_last_name', value)}
          />
        </div>

        <Email
          form={form}
          required={this.isEmailRequired()}
          isInvalid={invalidFields.includes('email')}
          onChange={value => this.setForm('email', value)}
        />

        <Phone
          form={form}
          isInvalid={invalidFields.includes('phone')}
          onChange={value => this.setForm('phone', value)}
        />

        <Role
          deal={deal}
          form={form}
          role_names={role_names}
          onChange={value => this.setForm('role', value)}
          isAllowed={this.isAllowedRole.bind(this)}
        />

        <Commission
          form={form}
          validateCommission={this.validateCommission.bind(this)}
          onChange={(field, value) => this.setForm(field, value)}
        />

        <Company
          form={form}
          onChange={value => this.setForm('company_title', value)}
          isInvalid={invalidFields.includes('company_title')}
        />
      </div>
    )
  }
}
