import React from 'react'
import pick from 'lodash/pick'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Stepper from '../../../../Partials/Stepper'
import Contact from '../../../../../models/Contact'
import Header from './Header'
import Information from './Information'
import Names from './Names'
import Tags from './Tags'
import Details from './Details'
import Address from './Address'
import AddNote from './Add-Note'
import Activities from './Activities'

import getContact from '../../../../../store_actions/contacts/get-contact'
import getContactActivities from '../../../../../store_actions/contacts/get-contact-activities'
import updateContact from '../../../../../store_actions/contacts/update-contact'
import addNewAttributes from '../../../../../store_actions/contacts/add-new-attributes'
import { selectContact } from '../../../../../reducers/contacts/list'
import { selectContactError } from '../../../../../reducers/contacts/contact'
import Loading from '../../../../Partials/Loading'

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

class ContactProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: 'timeline'
    }

    this.handleOnChangeAddress = this.handleOnChangeAddress.bind(this)
    this.handleChangeStage = this.handleChangeStage.bind(this)
    this.onChangeAttribute = this.onChangeAttribute.bind(this)
    this.handelNamesOnChangesAttributes = this.handelNamesOnChangesAttributes.bind(
      this
    )
  }

  componentDidMount() {
    let { contact } = this.props

    if (!contact) {
      this.getContact()
    } else if (!contact.activities) {
      this.getContactActivities(contact.id)
    }
  }

  async getContact() {
    const { user, getContact, params: { id: contactId } } = this.props

    await getContact(user, contactId)
    this.getContactActivities(contactId)
  }

  async getContactActivities(id) {
    await this.props.getContactActivities(id)
  }

  goBack = () => browserHistory.push('/dashboard/contacts')

  getStageIndex = contact => {
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

  async onChangeAttribute(type, id, text) {
    const {
      contact: { id: contactId },
      addNewAttributes,
      updateContact
    } = this.props

    const attributes = [
      {
        id: id || undefined,
        type,
        [type]: text
      }
    ]

    if (id) {
      return updateContact({
        contactId,
        attributes
      })
    }

    return addNewAttributes({
      contactId,
      attributes
    })
  }

  async handleOnChangeAddress(address, field, id, text) {
    const {
      updateContact,
      addNewAttributes,
      contact: { id: contactId }
    } = this.props
    const { street_name, city, state, postal_code } = address
    const attributes = [
      {
        type: 'address',
        id,
        street_name,
        city,
        state,
        postal_code
      }
    ]

    // set field
    attributes[0][field] = text

    if (id) {
      return updateContact({ contactId, attributes })
    }

    return addNewAttributes({ contactId, attributes })
  }

  async handleChangeStage(stage, contact) {
    const { id: contactId } = contact
    const { updateContact, addNewAttributes } = this.props

    const { id: attributeId } = Contact.get.stage(contact)

    const attributes = [
      {
        type: 'stage',
        id: attributeId || undefined,
        stage: stage.replace(/\s/g, '')
      }
    ]

    if (attributeId) {
      return updateContact({ contactId, attributes })
    }

    return addNewAttributes({ contactId, attributes })
  }

  getNames = names => {
    const { id } = names

    const nameFields = {
      first_name: '-',
      middle_name: '-',
      last_name: '-',
      legal_first_name: '-',
      legal_middle_name: '-',
      legal_last_name: '-'
    }

    const nameAttribute = {
      ...nameFields,
      ...pick(names, Object.keys(nameFields))
    }

    const getTitle = name =>
      name
        .split('_')
        .map(i => i.charAt(0).toUpperCase() + i.substr(1, i.length))
        .join(' ')

    if (Object.keys(nameAttribute).length > 0) {
      return Object.keys(nameAttribute).map(name => ({
        id,
        name,
        value: nameAttribute[name],
        title: getTitle(name)
      }))
    }
  }

  async handelNamesOnChangesAttributes(type, id, text) {
    const { contact, updateContact } = this.props
    const { id: contactId } = contact
    const { names } = contact.sub_contacts[0].attributes

    const attributes = [
      {
        ...names[0],
        [type]: text,
        type: 'name',
        id: id || undefined
      }
    ]

    return updateContact({
      contactId,
      attributes
    })
  }

  render() {
    const { user, params, contact, fetchError, defaultTags } = this.props
    const { activeTab } = this.state

    if (fetchError) {
      if (fetchError.status === 404) {
        browserHistory.push('/404')
      }

      return <Container>{fetchError.message}</Container>
    }

    if (!contact) {
      return (
        <Container>
          <Loading />
        </Container>
      )
    }

    const { names } = contact.sub_contacts[0].attributes

    return (
      <div className="profile">
        <Header goBackHandler={this.goBack} />

        <div className="content">
          <div className="left-pane">
            <Information contact={contact} />

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
                onChange={stage => this.handleChangeStage(stage, contact)}
              />
            </div>

            {Array.isArray(names) && (
              <Names
                names={this.getNames(names[0])}
                onChangeAttribute={this.handelNamesOnChangesAttributes}
              />
            )}

            <Tags
              contact_id={contact.id}
              user={user}
              tags={Contact.get.tags(contact, defaultTags)}
            />

            <Details
              contact={contact}
              onChangeAttribute={(...args) => this.onChangeAttribute(...args)}
            />

            <Address
              contact={contact}
              onChangeAddress={(...args) => this.handleOnChangeAddress(...args)}
            />
          </div>

          <div className="right-pane">
            <AddNote
              contactId={params.id}
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

const mapStateToProps = ({ contacts, user }, { params: { id: contactId } }) => {
  const { list, contact } = contacts

  return {
    user,
    contact: selectContact(list, contactId),
    fetchError: selectContactError(contact)
  }
}

export default connect(mapStateToProps, {
  getContact,
  updateContact,
  addNewAttributes,
  getContactActivities
})(ContactProfile)
