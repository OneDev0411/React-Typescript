import React from 'react'
import pick from 'lodash/pick'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Stepper from '../../../../Partials/Stepper'
import Contact from '../../../../../models/contacts'
import Header from './Header'
import Information from './Information'
import Names from './Names'
import Tags from './Tags'
import Details from './Details'
import Address from './Address'
import AddNote from './Add-Note'
import Activities from './Activities'

import {
  getContact,
  getContactActivities,
  upsertContactAttributes
} from '../../../../../store_actions/contacts'
import { selectContact } from '../../../../../reducers/contacts/list'
import { selectTags } from '../../../../../reducers/contacts/tags'
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

    this.handleChangeStage = this.handleChangeStage.bind(this)
    this.onChangeAttribute = this.onChangeAttribute.bind(this)
    this.handleOnChangeAddress = this.handleOnChangeAddress.bind(this)
    this.handelNamesOnChangesAttributes = this.handelNamesOnChangesAttributes.bind(
      this
    )
  }

  componentDidMount() {
    this.initializeContact()
  }

  async initializeContact() {
    const {
      user,
      contact,
      getContact,
      getContactActivities,
      params: { id: contactId }
    } = this.props

    if (!contact) {
      await getContact(user, contactId)
      await getContactActivities(contactId)
    } else if (!contact.activities) {
      await getContactActivities(contactId)
    }
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
    const { upsertContactAttributes, contact: { id: contactId } } = this.props

    const attributes = [
      {
        id: id || undefined,
        type,
        [type]: text
      }
    ]

    return upsertContactAttributes({
      contactId,
      attributes
    })
  }

  async handleOnChangeAddress(address, field, id, text) {
    const { upsertContactAttributes, contact: { id: contactId } } = this.props
    const { street_name, city, state, postal_code } = address
    const attributes = [
      {
        id,
        city,
        state,
        postal_code,
        street_name,
        [field]: text,
        type: 'address'
      }
    ]

    return upsertContactAttributes({
      contactId,
      attributes
    })
  }

  async handleChangeStage(stage) {
    const { contact, upsertContactAttributes } = this.props
    const { id: contactId } = contact

    const { id: attributeId } = Contact.get.stage(contact)

    const attributes = [
      {
        type: 'stage',
        id: attributeId || undefined,
        stage: stage.replace(/\s/g, '')
      }
    ]

    return upsertContactAttributes({
      contactId,
      attributes
    })
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
    const { contact, upsertContactAttributes } = this.props
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

    return upsertContactAttributes({
      contactId,
      attributes
    })
  }

  render() {
    const { params, contact, fetchError, defaultTags } = this.props

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

    const { activeTab } = this.state
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
                onChange={stage => this.handleChangeStage(stage)}
              />
            </div>

            {Array.isArray(names) && (
              <Names
                names={this.getNames(names[0])}
                onChangeAttribute={this.handelNamesOnChangesAttributes}
              />
            )}

            <Tags
              contactId={contact.id}
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
  const { list, contact, tags } = contacts

  const defaultTags = selectTags(tags)

  return {
    user,
    defaultTags,
    contact: selectContact(list, contactId),
    fetchError: selectContactError(contact)
  }
}

export default connect(mapStateToProps, {
  getContact,
  getContactActivities,
  upsertContactAttributes
})(ContactProfile)
