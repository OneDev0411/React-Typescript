import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import Stepper from '../../../../Partials/Stepper'
import Contact from '../../../../../models/Contact'
import Header from './Header'
import Information from './Information'
import Details from './Details'
import Address from './Address'
import AddNote from './Add-Note'
import Activities from './Activities'
import {
  getTimeline,
  updateContact,
  upsertAttributes
} from '../../../../../store_actions/contact'

class ContactProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'timeline'
    }
  }

  componentDidMount() {
    const { getTimeline } = this.props
    const contact = this.getContact()

    if (!contact.timeline) {
      getTimeline(contact.id)
    }
  }

  goBack() {
    browserHistory.push('/dashboard/contacts')
  }

  getContact() {
    const { contacts, params } = this.props
    const contact = contacts[params.id]

    return contact || this.goBack()
  }

  getStageIndex(contact) {
    const list = [
      'General',
      'UnqualifiedLead',
      'QualifiedLead',
      'Active',
      'PastClient'
    ]
    const stage = Contact.get.stage(contact)

    return list.indexOf(stage.name)
  }

  onChangeAttribute(type, id, text) {
    this.upsertAttributes(type, [{
      id,
      type,
      [type]: text
    }])
  }

  onChangeAddress(address, field, id, text) {
    const { street_name, city, state, postal_code } = address
    const attributes = [{
      type: 'address',
      id,
      street_name,
      city,
      state,
      postal_code
    }]

    // set field
    attributes[0][field] = text

    this.upsertAttributes('address', attributes)
  }

  onAddAttribute(type) {
    const { updateContact } = this.props
    const contact = this.getContact()
    const attributes = contact.sub_contacts[0].attributes
    const entity = `${type}s`

    if (!attributes[entity]) {
      attributes[entity] = []
    }

    attributes[entity].push({
      type,
      [type]: `Enter ${type} #${attributes[entity].length + 1}`
    })

    updateContact({
      ...contact,
      ...attributes
    })
  }

  upsertAttributes(type, attributes) {
    const { params, upsertAttributes } = this.props

    upsertAttributes(params.id, type, attributes)
  }

  changeStage(stage, contact) {
    const attributes = [{
      id: Contact.get.stage(contact).id,
      type: 'stage',
      stage: stage.replace(/\s/g, '')
    }]

    this.upsertAttributes('stage', attributes)
  }

  render() {
    const { user, params } = this.props
    const { activeTab } = this.state

    const contact = this.getContact()
    const emails = Contact.get.emails(contact)
    const phones = Contact.get.phones(contact)
    const birthdays = Contact.get.birthdays(contact)
    const companies = Contact.get.companies(contact)

    return (
      <div className="profile">
        <Header
          goBackHandler={this.goBack}
        />

        <div className="content">
          <div className="left-pane">
            <Information
              contact={contact}
            />

            <div className="card stage">
              <div className="title">Stage:</div>
              <Stepper
                steps={[
                  'General',
                  'Unqualified Lead',
                  'Qualified Lead',
                  'Active',
                  'Past Client'
                ]}
                active={this.getStageIndex(contact)}
                onChange={stage => this.changeStage(stage, contact)}
              />
            </div>

            <Details
              contact={contact}
              user={user}
              emails={emails}
              phones={phones}
              birthdays={birthdays}
              companies={companies}
              onChangeAttribute={(...args) => this.onChangeAttribute(...args)}
              onAddAttribute={(type) => this.onAddAttribute(type)}
            />

            <Address
              contact={contact}
              onChangeAddress={(...args) => this.onChangeAddress(...args)}
            />

          </div>

          <div className="right-pane">
            <AddNote
              user={user}
              contact_id={params.id}
              onSave={() => this.setState({ activeTab: 'notes' })}
            />

            <Activities
              contact={contact}
              activeTab={activeTab}
              onChangeTab={activeTab => this.setState({ activeTab })}
              onChangeAttribute={(...args) => this.onChangeAttribute(...args)}
            />
          </div>

        </div>
      </div>
    )
  }
}

export default connect(({ contacts, user }) => ({
  user,
  contacts: contacts.list
}), { getTimeline, upsertAttributes, updateContact })(ContactProfile)

