import React from 'react'
import _ from 'underscore'
import { Dropdown, MenuItem } from 'react-bootstrap'
import cn from 'classnames'
import Title from './title'
import FirstName from './first_name'
import LastName from './last_name'
import Email from './email'
import Phone from './phone'
import Role from './role'
import Company from './company'
import Commission from './commission'

const role_names = ['BuyerAgent', 'BuyerReferral', 'CoBuyerAgent', 'SellerAgent',
  'SellerReferral', 'CoSellerAgent', 'Buyer', 'Seller', 'Title', 'Lawyer', 'Lender',
  'TeamLead', 'Appraiser', 'Inspector', 'Tenant', 'Landlord']

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    const form = props.form || {}
    form.isNewRecord = (typeof form.email === 'undefined')

    this.state = {
      validation: {},
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

    this.setState({
      form: {
        ...form,
        [field]: value
      }
    }, () => this.validate(field, value))
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

    if (!/^[0-9]*$/.test(value)) {
      return false
    }

    return form.commission_percentage ? (value >= 0 && value <= 100) : value >= 0
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
   * validate form
   */
  async validate(field, value) {
    const { form, validation } = this.state
    let newValidation
    const requiredFields = ['legal_first_name', 'legal_last_name', 'role']

    const fields = {
      legal_first_name: (name) => name && name.length > 0,
      legal_last_name: (name) => name && name.length > 0,
      email: (email) => email && this.isEmail(email),
      phone: (phone) => phone && this.isValidPhone(phone),
      role: (role) => role
    }

    let commission_field = null
    if (form.commission_percentage !== undefined) {
      commission_field = 'commission_percentage'
    } else if (form.commission_dollar !== undefined) {
      commission_field = 'commission_dollar'
    }

    if (commission_field && Commission.shouldShowCommission(form)) {
      requiredFields.push(commission_field)
      fields[commission_field] = (value) => value && this.validateCommission(value)
    }

    // validate field
    const validator = fields[field]

    if (value.length > 0 && validator && !await validator(value)) {
      newValidation = {
        ...validation,
        [field]: 'error'
      }
    } else {
      newValidation = _.filter(validation, (value, key) => key !== field)
    }

    this.setState({
      validation: newValidation
    })

    const isFormCompleted = _.every(requiredFields, name => fields[name](form[name])) &&
      _.size(newValidation) === 0

    this.props.onFormChange({
      isFormCompleted,
      form
    })
  }

  render() {
    const { form, validation } = this.state

    return (
      <div className="deal-roles-form">

        <div className="row-name">
          <Title
            form={form}
            onChange={(value) => this.setForm('legal_prefix', value)}
          />

          <FirstName
            form={form}
            onChange={(value) => this.setForm('legal_first_name', value)}
          />

          <LastName
            form={form}
            onChange={(value) => this.setForm('legal_last_name', value)}
          />
        </div>

        <Email
          form={form}
          validation={validation}
          onChange={(value) => this.setForm('email', value)}
        />

        <Phone
          form={form}
          validation={validation}
          onChange={(value) => this.setForm('phone', value)}
        />

        <Role
          form={form}
          role_names={role_names}
          onChange={(value) => this.setForm('role', value)}
          isAllowed={this.isAllowedRole.bind(this)}
        />

        <Commission
          form={form}
          validateCommission={this.validateCommission.bind(this)}
          onChange={(field, value) => this.setForm(field, value)}
        />

        <Company
          form={form}
          onChange={(value) => this.setForm('company_title', value)}
        />
      </div>
    )
  }
}
