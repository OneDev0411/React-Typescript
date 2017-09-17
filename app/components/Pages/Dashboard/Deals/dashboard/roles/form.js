import React from 'react'
import { FormGroup, FormControl, DropdownButton, MenuItem } from 'react-bootstrap'

const role_names = [
  'BuyerAgent',
  'CoBuyerAgent',
  'SellerAgent',
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
      form: {}
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
    const { form, validation } = this.state

    return (
      <div>
        <input
          className="first_name"
          placeholder="First Name"
          onChange={e => this.setForm('first_name', e.target.value)}
        />

        <input
          className="last_name"
          placeholder="Last Name"
          onChange={e => this.setForm('last_name', e.target.value)}
        />

        <input
          className="email"
          placeholder="Email"
          onChange={e => this.setForm('email', e.target.value)}
        />

        <input
          className="phone"
          placeholder="Phone"
        />

        <DropdownButton
          id="deal-add-role--drp"
          className="deal-add-role--drp"
          title={form.role || 'Select Role'}
        >
          {
            role_names.map(name =>
              <MenuItem
                key={`ROLE_${name}`}
                onClick={() => this.setForm('role', name)}
              >
                { name }
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
