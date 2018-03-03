import React, { Fragment } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import ReactTable from 'react-table'
import Avatar from 'react-avatar'
import { Dropdown, MenuItem } from 'react-bootstrap'
import VerticalDotsIcon from '../../Partials/Svgs/VerticalDots'
import { confirmation } from '../../../../../store_actions/confirmation'

import Contact from '../../../../../models/contacts'

import {
  selectContacts,
  isFetchingContactsList
} from '../../../../../reducers/contacts/list'
import {
  deleteContact,
  upsertContactAttributes
} from '../../../../../store_actions/contacts'

import Header from './header'
import NoContact from './no-contact'
import Stage from '../components/Stage'
import Loading from '../../../../Partials/Loading'
import { Container } from '../components/Container'
import NoSearchResults from '../../../../Partials/no-search-results'
import ShadowButton from '../../../../../views/components/Button/ShadowButton'

function openContact(id) {
  browserHistory.push(`/dashboard/contacts/${id}`)
}

class ContactsList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filter: '',
      confirmation: null,
      deletingContact: null
    }

    this.columns = [
      {
        Header: () => (
          <Fragment>
            Name
            <i className="fa fa-caret-down" />
            <i className="fa fa-caret-up" />
          </Fragment>
        ),
        id: 'name',
        accessor: contact => Contact.get.name(contact),
        Cell: ({ original: contact }) => (
          <div className="name">
            <Avatar
              className="avatar"
              round
              name={Contact.get.name(contact)}
              src={Contact.get.avatar(contact)}
              size={35}
            />
            <span className="contact-name">{Contact.get.name(contact)}</span>
          </div>
        )
      },
      {
        Header: () => (
          <Fragment>
            EMAIL
            <i className="fa fa-caret-down" />
            <i className="fa fa-caret-up" />
          </Fragment>
        ),
        id: 'email',
        accessor: contact => Contact.get.email(contact),
        Cell: ({ original: contact }) => Contact.get.email(contact)
      },
      {
        Header: 'PHONE',
        id: 'phone',
        accessor: contact => Contact.get.phone(contact),
        Cell: ({ original: contact }) => Contact.get.phone(contact)
      },
      {
        Header: () => (
          <Fragment>
            STAGE
            <i className="fa fa-caret-down" />
            <i className="fa fa-caret-up" />
          </Fragment>
        ),
        id: 'stage',
        accessor: contact => Contact.get.stage(contact).name,
        className: 'td--dropdown-container',
        Cell: ({ original: contact }) => (
          <Stage
            defaultTitle={Contact.get.stage(contact).name}
            handleOnSelect={stage => this.onChangeStage(stage, contact)}
          />
        )
      },
      {
        Header: () => (
          <Fragment>
            SOURCE
            <i className="fa fa-caret-down" />
            <i className="fa fa-caret-up" />
          </Fragment>
        ),
        id: 'source',
        accessor: contact => Contact.get.source(contact).label,
        Cell: ({ original: contact }) => Contact.get.source(contact).label
      },
      {
        id: 'td-delete',
        Header: '',
        accessor: '',
        // accessor: contact => contact.id,
        className: 'td--dropdown-container',
        width: 30,
        Cell: ({ original: contact }) => {
          const { id: contactId } = contact

          return (
            <Dropdown
              pullRight
              className="c-react-table-menu"
              id={`cotnact_${contactId}__dropdown`}
            >
              <ShadowButton
                bsRole="toggle"
                style={{ marginTop: '5px' }}
                onClick={e => e.stopPropagation()}
              >
                <VerticalDotsIcon fill="#D7DEE2" />
              </ShadowButton>

              <Dropdown.Menu bsRole="menu">
                <MenuItem
                  eventKey="Delete"
                  key={`cotnact_${contactId}__dropdown__item_delete`}
                  style={{ width: '100%', textAlign: 'left' }}
                  onClick={event => this.handleOnDelete(event, contact.id)}
                >
                  Delete
                </MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          )
        }
      }
    ]

    this.handleOnDelete = this.handleOnDelete.bind(this)
    this.onChangeStage = this.onChangeStage.bind(this)
  }

  handleOnDelete(event, contactId) {
    event.stopPropagation()

    this.props.confirmation({
      show: true,
      confirmLabel: 'Delete',
      message: 'Delete Cotnact',
      onConfirm: () => this.handleDeleteContact({ contactId }),
      description: 'Are you sure you want to delete this contact?'
    })
  }

  async handleDeleteContact({ contactId }) {
    this.setState({ deletingContact: contactId })

    const { deleteContact } = this.props

    await deleteContact(contactId)
    this.setState({ deletingContact: null })
  }

  async onChangeStage(stage, contact) {
    const { upsertContactAttributes } = this.props
    const { id: contactId } = contact
    const attributes = [
      {
        id: Contact.get.stage(contact).id,
        type: 'stage',
        stage
      }
    ]

    await upsertContactAttributes({ contactId, attributes })
  }

  onInputChange = filter => this.setState({ filter })

  applyFilters = contact => {
    let matched = false
    const { filter } = this.state
    let regex = new RegExp(
      // / First reomoving some charater that break the regex
      filter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'),
      'i'
    )

    if (regex.test(Contact.get.name(contact))) {
      matched = true
    }

    if (!matched && Object.keys(Contact.get.emails(contact)).length !== 0) {
      matched = _.some(Contact.get.emails(contact), item =>
        regex.test(item.email)
      )
    }

    if (!matched && Object.keys(Contact.get.phones(contact)).length !== 0) {
      matched = _.some(Contact.get.phones(contact), item =>
        item.phone_number.includes(filter)
      )
    }

    if (!matched && Object.keys(Contact.get.tags(contact)).length !== 0) {
      matched = _.some(Contact.get.tags(contact), item => regex.test(item.tag))
    }

    return matched
  }

  render() {
    const { deletingContact } = this.state
    const { user, isFetching, contactsList, loadingImport } = this.props
    const contactsCount = contactsList.length

    if (isFetching && contactsCount === 0) {
      return (
        <Container>
          <Loading />
        </Container>
      )
    }

    if (contactsCount === 0) {
      return (
        <div className="list">
          <NoContact
            user={user}
            contactsCount={contactsCount}
            onNewContact={id => openContact(id)}
          />
        </div>
      )
    }

    const filteredContacts = contactsList.filter(contact =>
      this.applyFilters(contact)
    )

    return (
      <div className="list">
        <Header
          user={user}
          contactsCount={contactsCount}
          onNewContact={id => openContact(id)}
          onInputChange={this.onInputChange}
        />
        {loadingImport && (
          <i className="fa fa-spinner fa-pulse fa-fw fa-3x spinner__loading" />
        )}
        {_.size(filteredContacts) === 0 ? (
          <NoSearchResults description="Try typing another name, email, phone or tag." />
        ) : (
          <ReactTable
            className="list-table"
            pageSize={Object.keys(filteredContacts).length}
            showPaginationBottom={false}
            data={Object.values(filteredContacts)}
            columns={this.columns}
            getTrProps={(state, { original: { id: contactId } }) => {
              if (deletingContact === contactId) {
                return {
                  style: {
                    opacity: 0.5,
                    ponterEvents: 'none'
                  }
                }
              }

              return {
                onClick: () => openContact(contactId)
              }
            }}
          />
        )}
      </div>
    )
  }
}

function mapStateToProps({ user, contacts }) {
  const { list, spinner: loadingImport } = contacts
  const contactsList = selectContacts(list)
  const isFetching = isFetchingContactsList(list)

  return {
    user,
    isFetching,
    contactsList,
    loadingImport
  }
}

export default connect(mapStateToProps, {
  confirmation,
  deleteContact,
  upsertContactAttributes
})(ContactsList)
