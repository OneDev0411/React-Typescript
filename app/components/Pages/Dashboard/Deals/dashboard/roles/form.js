import React from 'react'
import _ from 'underscore'
import { Dropdown, MenuItem } from 'react-bootstrap'
import cn from 'classnames'
import roleNames from '../../utils/roles'

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
    form.isNewRecord = form.email === null

    if (form.isNewRecord) {
      const availableRoles = role_names.filter(name => this.isAllowed(name))
      const preselectedRole = availableRoles.length === 1 && availableRoles[0]

      if (preselectedRole) {
        form.role = preselectedRole
      }
    }

    this.state = {
      validation: {},
      commission_type: '%',
      form
    }

    this.validate = _.debounce(this.validate, 200)
  }

  /**
   * set form commission
   */
  setCommission(value) {
    if (!this.validateCommission(value)) {
      return false
    }

    this.setForm(this.getCommissionField(), value)
  }

  /**
   * set form commission type
   */
  setCommissionType(type) {
    const { form } = this.state

    delete form[this.getCommissionField()]

    this.setState({ commission_type: type }, () => this.setCommission(''))
  }

  /**
   * validate commission value
   */
  validateCommission(value) {
    const { commission_type } = this.state

    if (!/^[0-9]*$/.test(value)) {
      return false
    }

    return (commission_type === '%') ? (value >= 0 && value <= 100) : value >= 0
  }

  /**
   * get commission field name
   */
  getCommissionField() {
    const { commission_type } = this.state

    return (commission_type === '%') ?
      'commission_percentage' :
      'commission_dollar'
  }

  /**
   * get commission value
   */
  getCommissionValue() {
    const { form } = this.state

    return form[this.getCommissionField()]
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
   * check whether should show commission field or not
   */
  shouldShowCommission(form) {
    return ['CoBuyerAgent', 'BuyerAgent', 'BuyerReferral',
      'CoSellerAgent', 'SellerAgent', 'SellerReferral'].indexOf(form.role) > -1
  }

  /**
   * check role type is allowed to select or not
   */
  isAllowed(name) {
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
    const { form, validation, commission_type } = this.state
    const showCommission = this.shouldShowCommission(form)
    const requiredFields = ['legal_first_name', 'legal_last_name', 'email', 'role']

    if (showCommission) {
      requiredFields.push(this.getCommissionField())
    }

    const fields = {
      legal_first_name: (name) => name && name.length > 0,
      legal_last_name: (name) => name && name.length > 0,
      email: (email) => email && this.isEmail(email),
      phone: (phone) => phone && this.isValidPhone(phone),
      role: (role) => role
    }

    // set commission field name
    const commission_field = this.getCommissionField()

    // set commission field based on commission type
    fields[commission_field] = (value) => value && this.validateCommission(value)

    // validate field
    const validator = fields[field]

    if (value.length > 0 && validator && !await validator(value)) {
      this.setState({
        validation: {
          ...validation,
          [field]: 'error'
        }
      })
    } else {
      this.setState({
        validation: _.filter(validation, (value, key) => key !== field)
      })
    }

    const isFormCompleted = _.every(requiredFields, name => fields[name](form[name]))

    this.props.onFormCompleted(isFormCompleted ? form : null)
  }

  render() {
    const { form, commission_type, validation } = this.state
    const showCommission = this.shouldShowCommission(form)

    return (
      <div className="deal-roles-form">
        <Dropdown id="deal-add-role-title--drp" bsStyle="default">
          <Dropdown.Toggle>
            {form.legal_prefix || 'Title'}
          </Dropdown.Toggle>

          <Dropdown.Menu className="deal-add-role-title--drpmenu">
            {
              ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr']
                .map((name, key) =>
                  <MenuItem
                    key={`Title_${key}`}
                    style={{ width: '40%' }}
                    onClick={() => this.setForm('legal_prefix', name)}
                  >
                    {name}
                  </MenuItem>
                )
            }
          </Dropdown.Menu>
        </Dropdown>
        <div className="first_name">
          <input
            id="first_name"
            required="required"
            value={form.legal_first_name || ''}
            onChange={e => this.setForm('legal_first_name', e.target.value)}
          />
          <label htmlFor="first_name">Legal First Name</label>
        </div>
        <div className="last_name">
          <input
            id="last_name"
            required="required"
            value={form.legal_last_name || ''}
            onChange={e => this.setForm('legal_last_name', e.target.value)}
          />
          <label htmlFor="last_name">Legal Last Name</label>
        </div>
        <div className="input-container">
          <div className="email">
            <input
              id="email"
              required="required"
              className={cn({ invalid: validation.email === 'error' })}
              value={form.email || ''}
              onChange={e => this.setForm('email', e.target.value)}
            />
            <label htmlFor="email">Email</label>
          </div>
          {validation.email === 'error' && <span>Enter a valid email</span>}
        </div>

        <div className="input-container">
          <input
            className={cn('phone', { invalid: validation.phone === 'error' })}
            placeholder="Phone (xxx) xxx-xxxx"
            value={form.phone || ''}
            onChange={e => this.setForm('phone', e.target.value)}
          />
          {validation.phone === 'error' && <span>Enter a valid phone</span>}
        </div>

        <Dropdown id="deal-add-role--drp">
          <Dropdown.Toggle>
            {form.role ? roleNames(form.role) : 'Select a Role *'}
          </Dropdown.Toggle>

          <Dropdown.Menu className="deal-add-role--drpmenu u-scrollbar--thinner">
            {
              role_names
                .sort(name => this.isAllowed(name) ? -1 : 1)
                .map((name, key) => {
                  const isAllowed = this.isAllowed(name)

                  if (!isAllowed) {
                    return (
                      <li key={key} className="disabled">
                        <a href="#" onClick={e => e.preventDefault()}>{name}</a>
                      </li>
                    )
                  }

                  return (
                    <MenuItem
                      key={`ROLE_${name}`}
                      onClick={() => this.setForm('role', name)}
                    >
                      {roleNames(name)}
                    </MenuItem>
                  )
                })
            }
          </Dropdown.Menu>
        </Dropdown>

        {
          showCommission &&
          <div className="commission-row">
            <input
              className="radio"
              type="radio"
              name="commission_type"
              checked={commission_type === '%'}
              onChange={() => this.setCommissionType('%')}
            />&nbsp;&nbsp;%

            <input
              className="radio"
              type="radio"
              name="commission_type"
              checked={commission_type === '$'}
              onChange={() => this.setCommissionType('$')}
            />&nbsp;&nbsp;$
            <div className="commission">
              <input
                id="commission"
                required="required"
                type="number"
                value={this.getCommissionValue()}
                onChange={e => this.setCommission(e.target.value)}
              />
              <label htmlFor="commission">Commission</label>
            </div>
          </div>
        }

        {
          // company field can be hidden for the following role types: Buyer, Seller, Landlord, Tenant
          form.role && ['Buyer', 'Seller', 'Landlord', 'Tenant'].indexOf(form.role) === -1 &&
          <input
            className="company"
            placeholder="Company"
            value={form.company_title || ''}
            onChange={e => this.setForm('company_title', e.target.value)}
          />
        }
      </div>
    )
  }
}
