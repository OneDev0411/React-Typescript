import React from 'react'
import { FormGroup, FormControl, DropdownButton, MenuItem } from 'react-bootstrap'
import roleNames from '../../utils/roles'

const role_names = [
  // 'BuyerAgent',
  'CoBuyerAgent',
  // 'SellerAgent',
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

    this.state = {
      validation: {},
      form: props.form || {}
    }
  }

  setForm(field, value) {
    const { form } = this.state

    this.setState({
      form: {
        ...form,
        [field]: value
      }
    }, this.validate)
  }

  validate() {
    const fields = ['first_name', 'last_name', 'email', 'role']
    const { form } = this.state
    const validation = {}
    let validated = true

    fields.forEach(key => {
      if (!form[key] || form[key].length === 0) {
        validation[key] = 'error'
        validated = false
      }
    })

    this.setState({ validation })
    this.props.onFormCompleted(validated ? form : null)
  }

  render() {
    const { allowedRoles } = this.props
    const { form, validation } = this.state

    return (
      <div>
        <input
          className="first_name"
          placeholder="First Name"
          value={form.first_name || ''}
          onChange={e => this.setForm('first_name', e.target.value)}
        />

        <input
          className="last_name"
          placeholder="Last Name"
          value={form.last_name || ''}
          onChange={e => this.setForm('last_name', e.target.value)}
        />

        <input
          className="email"
          placeholder="Email"
          value={form.email || ''}
          onChange={e => this.setForm('email', e.target.value)}
        />

        <input
          className="phone"
          placeholder="Phone"
          value={form.phone || ''}
          onChange={e => this.setForm('phone', e.target.value)}
        />

        <DropdownButton
          id="deal-add-role--drp"
          className="deal-add-role--drp"
          title={form.role || 'Select Role'}
        >
          {
            role_names
            .filter(name => {
              if (!allowedRoles) {
                return true
              }

              return allowedRoles.indexOf(name) > -1
            })
            .map(name =>
              <MenuItem
                key={`ROLE_${name}`}
                onClick={() => this.setForm('role', name)}
              >
                { roleNames(name) }
              </MenuItem>
            )
          }

        </DropdownButton>

        <div className="role-descr">
          Just select the role of the signer and Rechat already knows where they need to sign.
        </div>
      </div>
    )
  }
}
