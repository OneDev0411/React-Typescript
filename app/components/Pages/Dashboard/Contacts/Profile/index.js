import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import { Container } from '../components/Container'
import Stage from './Stage'
import Contact from '../../../../../models/contacts'
import Header from './Header'
import Information from './Information'
import Names from './Names'
import Tags from './Tags'
import Details from './Details'
import Addresses from './Addresses'
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

class ContactProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: 'timeline'
    }

    this.handleAddNote = this.handleAddNote.bind(this)
    this.handleChangeStage = this.handleChangeStage.bind(this)
    this.onChangeAttribute = this.onChangeAttribute.bind(this)
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

  async onChangeAttribute({ contactId, attributes }) {
    return this.props.upsertContactAttributes({
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

  async handleAddNote(note) {
    const { contact, upsertContactAttributes } = this.props
    const { id: contactId } = contact

    await upsertContactAttributes({
      contactId,
      attributes: [
        {
          note,
          type: 'note'
        }
      ]
    })

    this.setState({ activeTab: 'notes' })

    return true
  }

  render() {
    const { contact, fetchError, defaultTags } = this.props

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

    return (
      <div className="profile">
        <Header goBackHandler={this.goBack} />

        <div className="content">
          <div className="left-pane">
            <Information contact={contact} />

            <Stage
              contact={contact}
              handleOnChange={stage => this.handleChangeStage(stage)}
            />

            <Names contact={contact} />

            <Tags
              contactId={contact.id}
              tags={Contact.get.tags(contact, defaultTags)}
            />

            <Details contact={contact} />

            <Addresses contact={contact} />
          </div>

          <div className="right-pane">
            <AddNote contact={contact} onSubmit={this.handleAddNote} />

            <Activities
              contact={contact}
              activeTab={activeTab}
              onChangeAttribute={this.onChangeAttribute}
              onChangeTab={activeTab => this.setState({ activeTab })}
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
