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
    const availableRoles = role_names.filter(name => this.isAllowed(name))
    const preselectedRole = availableRoles.length === 1 && availableRoles[0]

    if (preselectedRole) {
      form.role = preselectedRole
    }

    this.state = {
      validation: {},
      form
    }

    this.validate = _.debounce(this.validate, 200)
  }

  setCommission(value) {
    if (~~value < 0) {
      return false
    }

    this.setForm('commission', value)
  }

  setForm(field, value) {
    const { form } = this.state

    this.setState({
      form: {
        ...form,
        [field]: value
      }
    }, () => this.validate(field, value))
  }

  isEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return re.test(email)
  }

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

  shouldShowCommission(form) {
    return ['BuyerAgent', 'BuyerReferral', 'SellerAgent', 'SellerReferral']
      .indexOf(form.role) > -1
  }

  isAllowed(name) {
    const { deal, allowedRoles } = this.props

    const dealType = deal ? deal.deal_type : null

    if (
      (name === 'BuyerAgent' && dealType === 'Buying') ||
      (name === 'SellerAgent' && dealType === 'Selling')
    ) {
      return false
    }

    if (!allowedRoles) {
      return true
    }

    return allowedRoles.indexOf(name) > -1
  }

  async validate(field, value) {
    const { form, validation } = this.state
    const showCommission = this.shouldShowCommission(form)
    const requiredFields = ['legal_first_name', 'legal_last_name', 'email', 'role']

    if (showCommission) {
      requiredFields.push('commission')
    }

    const fields = {
      legal_first_name: (name) => name && name.length > 0,
      legal_last_name: (name) => name && name.length > 0,
      email: (email) => email && this.isEmail(email),
      phone: (phone) => phone && this.isValidPhone(phone),
      role: (role) => role,
      commission: (value) => value && ~~value >= 0
    }

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
    const { form, validation } = this.state
    const showCommission = this.shouldShowCommission(form)

    return (
      <div>
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

        <input
          className="first_name"
          placeholder="Legal First Name *"
          value={form.legal_first_name || ''}
          onChange={e => this.setForm('legal_first_name', e.target.value)}
        />

        <input
          className="last_name"
          placeholder="Legal Last Name *"
          value={form.legal_last_name || ''}
          onChange={e => this.setForm('legal_last_name', e.target.value)}
        />

        <div className="input-container">
          <input
            className={cn('email', { invalid: validation.email === 'error' })}
            placeholder="Email *"
            value={form.email || ''}
            onChange={e => this.setForm('email', e.target.value)}
          />
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

          <Dropdown.Menu className="deal-add-role--drpmenu">
            {
              role_names
                .sort(name => this.isAllowed(name) ? -1 : 1)
                .map((name, key) => {
                  const isAllowed = this.isAllowed(name)

                  if (!isAllowed) {
                    return (
                      <li key={key} className="disabled">
                        <a href="#" onClick={e => e.preventDefault()}>{ name }</a>
                      </li>
                    )
                  }

                  return (
                    <MenuItem
                      key={`ROLE_${name}`}
                      onClick={() => this.setForm('role', name)}
                    >
                      { roleNames(name) }
                    </MenuItem>
                  )
                })
            }
          </Dropdown.Menu>
        </Dropdown>

        {
          showCommission &&
          <input
            className="commission"
            placeholder="Commission *"
            type="number"
            min={0}
            value={form.commission || ''}
            onChange={e => this.setCommission(e.target.value)}
          />
        }

        {
          // company field can be hidden for the following role types: Buyer, Seller, Landlord, Tenant
          form.role && ['Buyer', 'Seller', 'Landlord', 'Tenant'].indexOf(form.role) === -1 &&
          <input
            className="company"
            placeholder="Company"
            value={form.title_company || ''}
            onChange={e => this.setForm('title_company', e.target.value)}
          />
        }
      </div>
    )
  }
}
